do add-navs = !->
  Template['bp-main-nav'].helpers 'main-nav-paths': -> BP.Nav.main-nav-paths
  Template['bp-second-nav'].helpers 'second-nav-paths': -> BP.Nav.second-nav-paths

do switch-bp-between-development-and-operation-mode = !->
  do switch-to-operation-mode-when-click-main-nav = !->
    Template['bp-main-nav'].rendered = !-> $ 'a.main-nav' .click -> BP.MODE = 'OPERATION'
    
  do switch-to-development-mode-when-click-second-nav = !->
    Template['bp-second-nav'].rendered = !-> $ 'a.second-nav' .click -> BP.MODE = 'DEVELOPMENT'


do make-splash-click-fadeout = !->
  Template.splash.events do
    'click':  (e)!->
      $ '#splash' .add-class 'fadeout'

    'webkitAnimationEnd': !->
      Router.go BP.Nav.main-nav-paths.0.path

do make-loading-spinner = !->
  Template.loading.rendered = !->
    @spinner = new Spinner!spin @find "#loading"

do initial-layout-semantic-ui = !->
  Template.layout.rendered = _.once ->
    $ '.launch-second-nav.item' .click ->
      $ '.sidebar.menu' .sidebar 'toggle'