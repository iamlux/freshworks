import React, { Component } from 'react';
import '../assets/css/App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destinations: [],
      vacations: [],
      itineraries: []
    };
    this.myRef = React.createRef();
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    axios.get('http://localhost:8000/api/sitemap')
      .then((response) => {
        const { destinations, vacations, itineraries } = response.data.data;
        const filters = [];
        itineraries.forEach((data) => {
          let text = data.text.toLowerCase().trim().charAt(0).toUpperCase();
          if (!isNaN(text)) {
            if (typeof filters["0-9"] === 'undefined') {
              filters["0-9"] = [];
            }
            filters["0-9"].push(data.text);
          } else {
            if (typeof filters[text] === 'undefined') {
              filters[text] = [];
            }
            filters[text].push(data.text);
          }
        });
        this.setState({
          destinations,
          vacations,
          itineraries: filters
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let lastScrollY = 0;
    lastScrollY = window.scrollY;
    if (lastScrollY >= this.myRef.current.offsetTop) {
      this.myRef.current.classList.add("sticky");
    } else {
      this.myRef.current.classList.remove("sticky");
    }
  }

  renderDestination() {
    return (
      <section className="sitemap-heading">
        <h4>Destinations</h4>
        {this.state.destinations.length > 0 ? <ul className="sitemap-heading__list">
          {this.state.destinations.map((data) => {
            return <li key={data.id}><a href={data.url} target="_blank">{data.text}</a></li>;
          })}
        </ul> : <p className="text-align-center">No data available</p>}
      </section>
    );
  }

  renderVacation() {
    return (<section className="sitemap-heading">
      <h4>Themed vacations</h4>
      {this.state.destinations.length > 0 ? <ul className="sitemap-heading__list">
        {this.state.vacations.map((data) => {
          return <li key={data.id}><a href={data.url} target="_blank">{data.text}</a></li>;
        })}
      </ul> : <p className="text-align-center">No data available</p>}
    </section>);
  }

  setPosition(elementId) {
    const ele = document.getElementById(elementId);
    this.myRef.current.classList.add("sticky");
    window.scrollTo(0, ele.offsetTop - document.getElementById('sitemap_filter_title').offsetHeight - 10);
  }

  renderFilterPages() {
    const itineraries = this.state.itineraries;
    debugger;
    return (
      <section className="sitemap-heading sitemap-filter" ref={this.myRef}>
        <h4>Showing all 321 pages</h4>
        {Object.keys(itineraries).length ? <React.Fragment><ul className="sitemap-filter__heading" id="sitemap_filter_title">
          {Object.keys(itineraries).sort().map((data, index) => {
            return <li key={index}><a href="javascript:void(0)" onClick={() => this.setPosition(data)}>{data}</a></li>;
          })}
        </ul>
          <div className="sitemap-filter__content">
            {Object.keys(itineraries).sort().map((data, index) => {
              return <div className="sitemap-filter__content__list" key={index} id={data}>
                <div className="sitemap-filter__content__list__index">
                  {data}
                </div>
                <div className="sitemap-filter__content__list__result">
                  <ul className="sitemap-heading__list">
                    {itineraries[data].map((value, index) => {
                      return <li key={index}>{value}</li>;
                    })}
                  </ul>
                </div>
              </div>
            })}
          </div></React.Fragment> : <p className="text-align-center">No data available</p>}
      </section>
    );
  }

  render() {
    return (
      <div className="sitemap">
        <header className="sitemap-header">
          <h2>Pickyourtrail sitemap</h2>
        </header>
        {this.renderDestination()}
        {this.renderVacation()}
        {this.renderFilterPages()}
      </div>
    );
  }
}

export default App;
