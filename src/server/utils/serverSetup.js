const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

/**
 * Конфигурация сервера — проект «Зона входа» (entrance-area)
 * Музейная экспозиция: главный дом, служебный корпус, коллекции, объекты и филиалы.
 * React + Vite, статика в build/, данные в public/data/
 */
const CONFIG = {
  // Порт сервера (не конфликтует с Vite dev 5173/5174)
  port: 3001,

  // Режим kiosk (полноэкранный режим)
  kioskMode: false,

  // Автоматически открывать браузер при запуске
  openBrowser: true,

  // Отключить проверку CORS в браузере (только для локальной разработки)
  disableWebSecurity: true,

  // Задержка перед открытием браузера (мс)
  browserDelay: 1000,

  // Путь к index.html (сборка Vite → build/)
  indexHtmlPath: 'index.html',

  // Папка со сборкой (vite.config.js: build.outDir = 'build')
  buildDirName: 'build',

  // Файлы данных (относительно public/ или build/); приложение читает из /data/*.json
  catalogItemsFile: path.join('data', 'collection.json'),
  progressPointsFile: path.join('data', 'progressPoints.json'),
  progressPointsSectionFile: path.join('data', 'progressPointsSection.json'),
  // Для совместимости с server/index.js (API предметов/статистики — опционально)
  gameItemsFile: path.join('data', 'collection.json'),
  statisticsFile: path.join('data', 'statistics.json'),
  tinderVotesFile: path.join('data', 'tinderVotes.json'),
};

/**
 * Класс для управления настройками и запуском сервера
 * Поддерживает как обычный запуск через node, так и сборку через pkg
 */
class ServerSetup {
  constructor() {
    try {
      // Корень проекта: __dirname = src/server/utils → вверх 3 уровня
      this.isPkg = typeof process.pkg !== 'undefined';
      this.baseDir = this.isPkg ? path.dirname(process.execPath) : path.join(__dirname, '..', '..', '..');

      this.config = {
        port: CONFIG.port,
        kioskMode: CONFIG.kioskMode,
        openBrowser: CONFIG.openBrowser,
        disableWebSecurity: CONFIG.disableWebSecurity,
        browserDelay: CONFIG.browserDelay,
        indexHtmlPath: CONFIG.indexHtmlPath,
        gameItemsFile: CONFIG.gameItemsFile,
        statisticsFile: CONFIG.statisticsFile,
        progressPointsFile: CONFIG.progressPointsFile,
        progressPointsSectionFile: CONFIG.progressPointsSectionFile,
        tinderVotesFile: CONFIG.tinderVotesFile,
      };

      if (!this.config.gameItemsFile) {
        throw new Error('CONFIG.gameItemsFile не задан (entrance-area: data/collection.json).');
      }

      // Директория со сборкой: в проекте Vite → build/ (см. vite.config.js)
      // В pkg: раздаём статику из текущей рабочей директории
      if (this.isPkg) {
        this.buildDir = process.cwd();
      } else {
        this.buildDir = path.join(this.baseDir, CONFIG.buildDirName || 'build');
      }

      if (this.isPkg) {
        this.gameItemsFile = path.join(this.baseDir, this.config.gameItemsFile);
        this.statisticsFile = path.join(this.baseDir, this.config.statisticsFile);
        this.progressPointsFile = path.join(this.baseDir, this.config.progressPointsFile);
        this.progressPointsSectionFile = path.join(this.baseDir, this.config.progressPointsSectionFile);
        this.tinderVotesFile = path.join(this.baseDir, this.config.tinderVotesFile);
        this.gameItemsFileFallback = null;
        this.statisticsFileFallback = null;
        this.progressPointsFileFallback = null;
        this.progressPointsSectionFileFallback = null;
        this.tinderVotesFileFallback = null;
      } else {
        const buildData = (name) => path.join(this.buildDir, this.config[name]);
        const publicData = (name) => path.join(this.baseDir, 'public', this.config[name]);

        this.gameItemsFile = buildData('gameItemsFile');
        this.gameItemsFileFallback = publicData('gameItemsFile');
        this.statisticsFile = buildData('statisticsFile');
        this.statisticsFileFallback = publicData('statisticsFile');
        this.progressPointsFile = buildData('progressPointsFile');
        this.progressPointsFileFallback = publicData('progressPointsFile');
        this.progressPointsSectionFile = buildData('progressPointsSectionFile');
        this.progressPointsSectionFileFallback = publicData('progressPointsSectionFile');
        this.tinderVotesFile = buildData('tinderVotesFile');
        this.tinderVotesFileFallback = publicData('tinderVotesFile');
      }

      this.getGameItemsFile = this.getGameItemsFile.bind(this);
      this.getStatisticsFile = this.getStatisticsFile.bind(this);
      this.getProgressPointsFile = this.getProgressPointsFile.bind(this);
      this.getProgressPointsSectionFile = this.getProgressPointsSectionFile.bind(this);
      this.getTinderVotesFile = this.getTinderVotesFile.bind(this);

      this.indexHtmlExists = false;
    } catch (error) {
      console.error('❌ Ошибка в конструкторе ServerSetup:', error);
      throw error;
    }
  }

  getBaseDir() {
    return this.baseDir;
  }

  getBuildDir() {
    return this.buildDir;
  }

  async _resolveDataFile(primary, fallback, label) {
    try {
      if (this.isPkg) {
        if (!primary) throw new Error(`${label} не определен в pkg режиме`);
        return primary;
      }
      if (!primary) throw new Error(`${label} не определен`);
      if (typeof fs.pathExists !== 'function') return primary;
      const buildExists = await fs.pathExists(primary);
      if (buildExists) return primary;
      if (fallback) {
        const publicExists = await fs.pathExists(fallback);
        if (publicExists) return fallback;
      }
      return primary;
    } catch (error) {
      console.error(`❌ Ошибка в ${label}:`, error);
      throw error;
    }
  }

  async getGameItemsFile() {
    return this._resolveDataFile(this.gameItemsFile, this.gameItemsFileFallback, 'getGameItemsFile');
  }

  async getStatisticsFile() {
    return this._resolveDataFile(this.statisticsFile, this.statisticsFileFallback, 'getStatisticsFile');
  }

  async getProgressPointsFile() {
    return this._resolveDataFile(this.progressPointsFile, this.progressPointsFileFallback, 'getProgressPointsFile');
  }

  async getProgressPointsSectionFile() {
    return this._resolveDataFile(
      this.progressPointsSectionFile,
      this.progressPointsSectionFileFallback,
      'getProgressPointsSectionFile'
    );
  }

  async getTinderVotesFile() {
    try {
      if (this.tinderVotesFileFallback && !this.isPkg) {
        const resolved = await this._resolveDataFile(
          this.tinderVotesFile,
          this.tinderVotesFileFallback,
          'getTinderVotesFile'
        );
        return resolved;
      }
      return this.tinderVotesFile;
    } catch (error) {
      console.error('❌ Ошибка в getTinderVotesFile:', error);
      throw error;
    }
  }

  isPkgMode() {
    return this.isPkg;
  }

  getAppUrl() {
    return `http://localhost:${this.config.port}`;
  }

  getApiUrl() {
    return `http://localhost:${this.config.port}/api`;
  }

  async checkIndexHtml() {
    try {
      let indexHtmlPath = path.join(this.buildDir, this.config.indexHtmlPath);
      let exists = await fs.pathExists(indexHtmlPath);

      if (!exists && this.isPkg) {
        const baseDirIndex = path.join(this.baseDir, this.config.indexHtmlPath);
        if (await fs.pathExists(baseDirIndex)) {
          this.buildDir = this.baseDir;
          indexHtmlPath = baseDirIndex;
          exists = true;
          console.log(`✅ ${this.config.indexHtmlPath} найден в папке exe: ${indexHtmlPath}`);
        }
      }

      this.indexHtmlExists = exists;

      if (!exists) {
        console.warn(`\n⚠️  Файл ${this.config.indexHtmlPath} не найден в ${this.buildDir}`);
        console.log('   Сервер запустится; в браузере откроется страница с инструкцией.');
        console.log('   Выполните "npm run build", затем запускайте сервер из корня проекта.');
        console.log('   Убедитесь, что в vite.config.js задано build.outDir: "build".\n');
      } else {
        console.log(`✅ ${this.config.indexHtmlPath} найден: ${indexHtmlPath}`);
      }
      return exists;
    } catch (error) {
      console.error('❌ Ошибка при проверке index.html:', error);
      this.indexHtmlExists = false;
      return false;
    }
  }

  async openBrowser() {
    if (!this.config.openBrowser) return;

    if (os.platform() !== 'win32') {
      console.log('⚠️  Автооткрытие браузера только на Windows');
      console.log(`🌐 Откройте вручную: ${this.getAppUrl()}`);
      return;
    }

    const url = this.getAppUrl();
    if (!this.config.kioskMode) {
      console.log('💡 Kiosk выключен — DevTools доступны (F12)');
    }
    if (this.config.disableWebSecurity) {
      console.log('⚠️  CORS отключен в браузере (только для разработки).');
    }

    const chromePath = process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe';
    const edgePath = process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe';
    const chromeExists = await fs.pathExists(chromePath);

    if (chromeExists) {
      let chromeFlags = '';
      if (this.config.disableWebSecurity) {
        chromeFlags += `--disable-web-security --user-data-dir="${os.tmpdir()}\\ChromeTempProfile" `;
      }
      if (this.config.kioskMode) {
        chromeFlags += `--autoplay-policy=no-user-gesture-required --app="${url}" --start-fullscreen --kiosk --disable-features=Translate,ContextMenuSearchWebFor,ImageSearch`;
      } else {
        chromeFlags += `--app="${url}" --auto-open-devtools-for-tabs`;
      }
      exec(`"${chromePath}" ${chromeFlags}`, (error) => {
        if (error) console.error('❌ Ошибка открытия Chrome:', error);
      });
      if (this.config.kioskMode) {
        setTimeout(() => {
          exec('taskkill /f /im explorer.exe', (error) => {
            if (error && !error.message.includes('не найден')) console.error('⚠️  explorer.exe:', error.message);
          });
        }, 12000);
      }
    } else {
      const edgeExists = await fs.pathExists(edgePath);
      if (edgeExists) {
        if (this.config.kioskMode) {
          exec('reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "TranslateEnabled" /t REG_DWORD /d 0 /f >nul 2>&1', () => {});
          exec('reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v "ContextMenuSearchEnabled" /t REG_DWORD /d 0 /f >nul 2>&1', () => {});
        }
        let edgeFlags = '';
        if (this.config.disableWebSecurity) {
          edgeFlags += `--disable-web-security --user-data-dir="${os.tmpdir()}\\EdgeTempProfile" `;
        }
        if (this.config.kioskMode) {
          edgeFlags += `--kiosk "${url}" --edge-kiosk-type=fullscreen --no-first-run --disable-features=msEdgeSidebarV2,msHub,msWelcomePage`;
        } else {
          edgeFlags += `"${url}"`;
        }
        exec(`"${edgePath}" ${edgeFlags}`, (error) => {
          if (error) console.error('❌ Ошибка открытия Edge:', error);
        });
      } else {
        console.error('❌ Chrome и Edge не найдены. Откройте вручную:', url);
      }
    }
  }

  async initializeDataDir() {
    try {
      const gameItemsFile = await this.getGameItemsFile();
      if (!gameItemsFile) {
        throw new Error('Путь к данным (data/collection.json) не определён.');
      }

      await fs.ensureDir(path.dirname(gameItemsFile));

      const gameItemsExists = await fs.pathExists(gameItemsFile);
      console.log(`📂 collection.json (данные): ${gameItemsExists ? '✅' : '❌'} ${gameItemsFile}`);

      const progressPath = await this.getProgressPointsFile().catch(() => null);
      if (progressPath) {
        await fs.ensureDir(path.dirname(progressPath));
        const progressExists = await fs.pathExists(progressPath);
        console.log(`📂 progressPoints.json: ${progressExists ? '✅' : '❌'} ${progressPath}`);
      }

      const sectionPath = await this.getProgressPointsSectionFile().catch(() => null);
      if (sectionPath) {
        await fs.ensureDir(path.dirname(sectionPath));
        const sectionExists = await fs.pathExists(sectionPath);
        console.log(`📂 progressPointsSection.json: ${sectionExists ? '✅' : '❌'} ${sectionPath}`);
      }

      if (this.statisticsFileFallback || this.statisticsFile) {
        const statisticsFile = await this.getStatisticsFile().catch(() => null);
        if (statisticsFile) {
          await fs.ensureDir(path.dirname(statisticsFile));
          const statisticsExists = await fs.pathExists(statisticsFile);
          console.log(`📂 statistics.json (опц.): ${statisticsExists ? '✅' : '❌'} ${statisticsFile}`);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Ошибка инициализации данных:', error);
      return false;
    }
  }

  logServerInfo() {
    console.log(`🚀 Зона входа (entrance-area) — сервер на порту ${this.config.port}`);
    console.log(`📁 Данные: ${this.gameItemsFile}`);
    console.log(`📂 Статика: ${this.buildDir}`);
    console.log(`📂 Корень: ${this.baseDir}`);
    console.log(`🌐 Приложение: ${this.getAppUrl()}`);
    console.log(`🔧 Kiosk: ${this.config.kioskMode ? '✅' : '❌'}`);
    console.log(`🔒 CORS отключен в браузере: ${this.config.disableWebSecurity ? '✅ (небезопасно)' : '❌'}`);
    if (this.config.openBrowser) console.log(`🌐 Автооткрытие браузера: ✅`);
  }

  setupStaticFiles(app, express) {
    app.use(express.static(this.buildDir));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      const indexPath = path.join(this.buildDir, this.config.indexHtmlPath);
      if (this.indexHtmlExists) {
        res.sendFile(indexPath);
      } else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(this._getIndexHtmlHelpPage());
      }
    });
  }

  _getIndexHtmlHelpPage() {
    const buildDir = this.buildDir.replace(/\\/g, '\\\\');
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Запуск приложения — Зона входа (entrance-area)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
    h1 { font-size: 1.25rem; color: #c00; }
    code { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 4px; }
    ol { margin: 1rem 0; padding-left: 1.5rem; }
    .path { word-break: break-all; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>index.html не найден</h1>
  <p>Сервер запущен, но в папке со сборкой нет <code>index.html</code>.</p>
  <p><strong>Что сделать:</strong></p>
  <ol>
    <li>В корне проекта выполните: <code>npm run build</code></li>
    <li>Убедитесь, что в <code>vite.config.js</code> указано <code>build.outDir: 'build'</code>. Запускайте сервер из корня проекта — статика будет браться из <code>build/</code>.</li>
    <li>Либо скопируйте из <code>build</code> файл <code>index.html</code> и папки <code>assets</code>, <code>data</code>, <code>images</code> в папку с <code>launch.exe</code> и обновите страницу (F5).</li>
  </ol>
  <p class="path">Папка, в которой ищется index.html: ${this.buildDir}</p>
</body>
</html>`;
  }

  async startServer(app, onReady) {
    try {
      await this.checkIndexHtml();

      app.listen(this.config.port, async () => {
        try {
          this.logServerInfo();
          if (onReady) await onReady();
          if (this.config.openBrowser) {
            setTimeout(async () => {
              try {
                await this.openBrowser();
              } catch (error) {
                console.error('❌ Ошибка открытия браузера:', error);
                console.log(`🌐 Откройте вручную: ${this.getAppUrl()}`);
              }
            }, this.config.browserDelay);
          }
        } catch (error) {
          console.error('❌ Ошибка после запуска:', error);
          throw error;
        }
      }).on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`\n❌ Порт ${this.config.port} занят. Закройте другое приложение или смените порт.`);
        } else {
          console.error('\n❌ Ошибка запуска:', error.message);
        }
        console.log('\n⚠️  Окно закроется через 30 секунд...');
        setTimeout(() => process.exit(1), 30000);
      });
    } catch (error) {
      console.error('❌ Ошибка в startServer:', error);
      throw error;
    }
  }
}

module.exports = ServerSetup;
