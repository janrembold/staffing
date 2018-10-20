import React, { Component } from 'react';
import Workload from '../workload/Workload';
import Projects from '../projects/Projects';
import {connect} from "react-redux";
import './dashboard.css';

const mapStateToProps = state => {
  const teams = [];

  state.data.users.forEach(element => {
    if(element.team && teams.indexOf(element.team) === -1) {
      teams.push(element.team);
    }
  });

  teams.sort();
  return {teams};
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {
      team: ''
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      team: e.target.value
    });
  }

  render() {
    const teamOptions = this.props.teams.map((team, idx) => <option key={idx} value={team}>{team}</option>);
    teamOptions.unshift(<option key="-1" value="">All</option>);

    return (
      <div className="dashboard">

        <div className="grid-x grid-padding-x">
          <div className="cell">
            <h4 className="dashboard__workloadHeadline">Team Overview</h4>
            <select onChange={this.handleChange} className="dashboard__teamSelect">
              {teamOptions}
            </select>
            <Workload team={this.state.team} />
          </div>
        </div>

        <div className="grid-x grid-padding-x">
          <div className="cell">
            <Projects />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
