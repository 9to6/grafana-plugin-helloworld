import {PanelCtrl} from 'app/plugins/sdk';

const panelDefaults = {
  method: 'GET',
  baseUrl: 'http://localhost:8080',
  url: 'http://localhost:8080/v1/apps',
  errorMode: 'show',
	appName: 'DVR_FG1',
	appId: ''
}

export class HelloCtrl extends PanelCtrl {
  constructor($scope, $injector, $http) {
    super($scope, $injector)
		this.$http = $http
    _.defaults(this.panel, panelDefaults)

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this))
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this))
    this.events.on('panel-initialized', this.render.bind(this))
		this.initData()
  }

  onInitEditMode() {
		console.log('entering edit mode')
    this.addEditorTab('Options', 'public/plugins/' + this.pluginId + '/editor.html', 2)
  }

  onPanelTeardown() {
		console.log('teared down')
  }

	initData() {
		this.panelTabIndex = 0
	}

  link(scope, elem) {
		console.log('link')
		console.log(scope)
		console.log(elem)

		let ret = this.getStackInfo()
		ret.then(() => {
			this.getApps().then(() => {
				console.log(this.ondemandApps)
			})
		})

  }

	getStackInfo() {
		return this.$http({
        method: 'GET',
        url: `${this.panel.baseUrl}/v1/stacks`
      }).then(response => {
				this.stack = response.data[0]
			}).then(() => {
				return this.$http({
					method: 'GET',
					url: `${this.panel.baseUrl}/v1/stacks/${this.stack.stack_id}/zones`
				})
			}).then(response => {
				this.stackZones = response.data
			}).catch(err => {
				console.log(err)
			})
	}

	getApps() {
		return this.$http({
				method: 'GET', 
        url: `${this.panel.baseUrl}/v1/apps`
			}).then( response => {
				var data = response.data
				for(let app of data) {
					if (this.panel.appName == app.name) {
						console.log(app.name)
						this.app = app
					}
				}
				console.log(data.length)
			}).then(() => {
				return this.$http({
						method: 'GET',
						url: `${this.panel.baseUrl}/v1/apps/${this.app.app_id}/groups`
					})
			}).then((response) => {
				var data = response.data
				let ondemandApps = new Array()
				for(let appGroup of data) {
					if (appGroup.type == 'ondemand') {
						ondemandApps.push(appGroup)
					}
				}
				this.ondemandApps = ondemandApps
			}).catch(err => {
				this.error = err //.data.error + " ["+err.status+"]";
				console.warn('error', err)
			})
	}

	changePanelTab(index) {
		console.log("index: " + index)
		console.log("ctrl.panelTabIndex:" + this.panelTabIndex)
		this.panelTabIndex = index
	}

	updatePanel(app) {
		this.app = app
		this.appID = app.app_id
		console.log(app.app_id)

		this.$http({
        method: this.panel.method,
        url: `${this.panel.baseUrl}/v1/apps/${this.appID}/groups`
      }).then( response => {
        var data = response.data
				let ondemandApps = new Array()
				for(let appGroup of data) {
					if (appGroup.type == 'ondemand') {
						ondemandApps.push(appGroup)
					}
				}
				console.log(ondemandApps)
      }, (err) => {
        this.error = err //.data.error + " ["+err.status+"]";

        console.warn('error', err)
        let body = '<h1>Error</h1><pre>' + JSON.stringify(err, null, " ") + "</pre>"
      })
	}
}

HelloCtrl.templateUrl = 'module.html';
