// @flow
let _navigator = null
// Private API only used by config sagas
export const _setNavigator = (navigator: any) => {
  _navigator = navigator
}
export const _getNavigator = () => {
  return _navigator
}
// Private API only used by config sagas

const findVisibleRoute = (arr, s) => {
  if (!s) return arr
  if (!s.routes) return s
  const route = s.routes[s.index]
  if (!route) return arr
  if (route.routes) return findVisibleRoute([...arr, route], route)
  return [...arr, route]
}

const findModalRoute = (arr, s) => {
  const loggedInOut = s.routes[s.index]
  // only logged in has modals
  if (!loggedInOut || loggedInOut.routeName !== 'loggedIn') {
    return []
  }

  return loggedInOut.routes.slice(1)
}

const findFullRoute = s => {
  const loggedInOut = s.routes[s.index]
  if (loggedInOut.routeName === 'loggedIn') {
    return [...loggedInOut.routes[0].routes, loggedInOut.routes[1]].filter(Boolean)
  }
  return loggedInOut.routes
}

// Private API used by navigator itself
export const _getVisiblePathForNavigator = (navState: any) => {
  if (!navState) return []
  return findVisibleRoute([], navState)
}

export const _getModalStackForNavigator = (navState: any) => {
  if (!navState) return []
  return findModalRoute([], navState)
}

export const _getFullRouteForNavigator = (navState: any) => {
  if (!navState) return []
  return findFullRoute(navState)
}

// Public API
export const getVisiblePath = () => {
  if (!_navigator) return []
  return findVisibleRoute([], _navigator.getNavState())
}

export const getModalStack = () => {
  if (!_navigator) return []
  return findModalRoute([], _navigator.getNavState())
}

export const getVisibleScreen = () => {
  const visible = getVisiblePath()
  return visible[visible.length - 1]
}

export const getFullRoute = () => {
  if (!_navigator) return []
  return findFullRoute(_navigator.getNavState())
}
