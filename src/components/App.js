import React, { Component } from 'react';
import '../assets/css/App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      selectedApps: [],
      installed_apps: [],
      showAllApps: false,
      openDialog: false,
      categories: [],
      selectedApp: {},
    };
    this.openAllApps = this.openAllApps.bind(this);
    this.selectedCategories = this.selectedCategories.bind(this);
    this.installApp = this.installApp.bind(this);
    this.closeAllApps = this.closeAllApps.bind(this);
  }

  componentWillMount() {
    axios.get('https://api.jsonbin.io/b/5bee9acc3c134f38b019e808/1')
      .then((response) => {
        let categories = ["All"];
        response.data.data.forEach(element => {
          if (categories.indexOf(element.category) === -1) {
            categories.push(element.category);
          }
        });
        this.setState({
          apps: response.data.data,
          selectedApps: response.data.data,
          categories: categories
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  openAllApps() {
    this.setState({
      showAllApps: true
    });
  }

  closeAllApps() {
    this.setState({
      showAllApps: false
    });
  }

  selectedCategories(name) {
    let apps;
    if (name === "all") {
      apps = this.state.apps;
    } else {
      apps = this.state.apps.filter((val) => {
        return val.category === name;
      });
    }


    this.setState({
      selectedApps: apps
    });
  }

  openInstallDialog(id) {
    const app = this.state.apps.filter((val) => {
      return val.id === id
    });
    this.setState({
      openDialog: true,
      selectedApp: (app.length > 0) ? app[0] : {}
    });
  }

  installApp(id) {
    const installedApps = this.state.installed_apps;
    const selectedApp = this.state.apps.filter((val) => {
      return val.id === id;
    });
    installedApps.push(selectedApp[0]);
    this.setState({
      installed_apps: installedApps,
      openDialog: false,
    });
  }


  deleteApp(id) {
    const installedApps = this.state.installed_apps;
    const selectedAppIndex = installedApps.findIndex((val) => {
      return val.id === id;
    });
    installedApps.splice(selectedAppIndex, 1);
    this.setState({
      installed_apps: installedApps
    });
  }
  renderAllApps() {
    return (<ul className="installed-apps">
      {this.state.selectedApps.map((val) => {
        return <li key={val.id} className="installed-app" onClick={() => this.openInstallDialog(val.id)}>
          <img src={val.imageUrl} />
          {val.name}
        </li>;
      })}
    </ul>);
  }

  renderInstalledApp() {
    if (this.state.installed_apps.length > 0) {
      return (<ul>
        {this.state.installed_apps.map((val) => {
          return <li key={val.id} className="installed-app">
            <img src={val.imageUrl} />
            <div className="app-description">
              <p>{val.name}</p>
              <p>{val.description}</p>
              <button onClick={() => this.deleteApp(val.id)}>Delete</button>
            </div>
          </li>;
        })}
      </ul>);
    } else {
      return <p className="no-data-available">No Apps Installed</p>
    }

  }

  renderCategories() {
    return (<ul>
      {this.state.categories.map((val) => {
        return <li key={val} onClick={() => this.selectedCategories(val)}>{val}</li>
      })}
    </ul>);
  }

  renderDialog() {
    return (<div className="selectedApp">
      <img src={this.state.selectedApp.imageUrl} />
      <div className="app-description">
        <p>{this.state.selectedApp.name}</p>
        <p>{this.state.selectedApp.description}</p>
        <button onClick={() => this.installApp(this.state.selectedApp.id)}>Install</button>
      </div>
    </div>);
  }


  render() {
    return (
      <div className="freshworks">
        <header className="freshworks-header">
          <div className="freshworks-header__apps">
            <h3>Apps</h3>
          </div>
          <div className="freshworks-header__button">
            <button onClick={() => this.openAllApps()}>Get Apps</button>
          </div>
        </header>
        <section className="freshworks-body">
          {this.state.showAllApps && <React.Fragment>
            <div className="categories">{this.renderCategories()}</div>
            <div className="selected-body">
              {!this.state.openDialog ? <div className="allApps">
                {this.renderAllApps()}
                <p className="closeApps" onClick={() => this.closeAllApps()}>Close</p>
              </div>
                : <div className="installed-dialog">
                  {this.renderDialog()}
                </div>
              }</div></React.Fragment>
          }
          {!this.state.showAllApps && <div className="installedApps">
            {this.renderInstalledApp()}
          </div>
          }
        </section>
      </div>
    );
  }
}

export default App;
