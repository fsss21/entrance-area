import { Routes, Route } from 'react-router-dom'
import styles from './App.module.css'


import Header from './components/Header/Header'
import MainMenu from './pages/MainMenu/MainMenu'
import MenuMap from './pages/MenuMap/MenuMap'
import ServiceBuilding from './pages/ServiceBuilding/ServiceBuilding'
import ServiceBuildingItem from './pages/ServiceBuilding/ServiceBuildingItem'
import MainHouse from './pages/MainHouse/MainHouse'
import MainHouseItem from './pages/MainHouse/MainHouseItem'
import Collection from './pages/Collection/Collection'
import CollectionItems from './pages/Collection/CollectionItems'
import CollectionItem from './pages/Collection/CollectionItem'
import ScientificActivity from './pages/ScientificActivity/ScientificActivity'
import EducationalPrograms from './pages/EducationalPrograms/EducationalPrograms'
import ObjectsBranches from './pages/ObjectsBranches/ObjectsBranches'
import BranchPage from './pages/ObjectsBranches/BranchPage'
import ActualInfo from './pages/ActualInfo/ActualInfo'
import ActualInfoSection from './pages/ActualInfoSection/ActualInfoSection'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Routes>
        <Route path='/' element={<MainMenu />} />
        <Route path='/menu-map' element={<MenuMap />} />
        <Route path='/service-building' element={<ServiceBuilding />} />
        <Route path='/service-building/item/:floor/:hallIndex' element={<ServiceBuildingItem />} />
        <Route path='/main-house' element={<MainHouse />} />
        <Route path='/main-house/item/:hallIndex' element={<MainHouseItem />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/collection/item/:collectionIndex/:itemIndex' element={<CollectionItem />} />
        <Route path='/collection/:collectionIndex' element={<CollectionItems />} />
        <Route path='/scientific-activity' element={<ScientificActivity />} />
        <Route path='/educational-programs' element={<EducationalPrograms />} />
        <Route path='/objects-branches' element={<ObjectsBranches />} />
        <Route path='/objects-branches/branch/:branchId' element={<BranchPage />} />
        <Route path='/actual-info' element={<ActualInfo />} />
        <Route path='/actual-info/:section' element={<ActualInfoSection />} />
        <Route path='*' element={<div>Страница не найдена</div>} />
      </Routes>
    </div>
  )
}

export default App
