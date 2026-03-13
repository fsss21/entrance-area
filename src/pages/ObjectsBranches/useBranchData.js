import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { loadData } from '../../api/loadData'

export function useBranchData() {
  const navigate = useNavigate()
  const location = useLocation()
  const { branchId } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    loadData('objects-branches.json').then(setData)
  }, [])

  const branches = data?.branches ?? []
  const branch = branches.find((b) => b.id === branchId)

  useEffect(() => {
    if (!branch) return
    const title = branch.name
    const titleColor = branch.color ?? location.state?.pageTitleColor
    const nextState = { ...location.state, pageTitle: title }
    if (titleColor != null) nextState.pageTitleColor = titleColor
    if (title && (location.state?.pageTitle !== title || location.state?.pageTitleColor !== titleColor)) {
      navigate(location.pathname, { state: nextState, replace: true })
    }
    document.title = title ?? 'Филиал'
  }, [branch, location.pathname, location.state?.pageTitle, location.state?.pageTitleColor, navigate])

  return { data, branch, branchId, navigate, location }
}
