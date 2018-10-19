import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import './configForm.css';
import {config} from '../../config';

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    errorMessage: state.errorMessage
  };
};

class ConfigForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    window.localStorage.setItem('databaseHost', e.target[0].value.replace(/\/$/, ""));
    window.localStorage.setItem('databaseToken', e.target[1].value);
    window.localStorage.setItem('year', e.target[2].value);

    axios.defaults.headers.common['token'] = e.target[1].value;

    window.location.reload();
  }

  render() {
    const yearOptions = [];
    for (let y = 2018; y <= 2025; y++) {
      yearOptions.push(<option key={y} value={y}>{y}</option>);
    }

    return (
      <form className="configForm" onSubmit={this.handleSubmit}>
        <div className="grid-container">
          <div className="grid-x grid-padding-x">
            <div className="cell configForm__error">{this.props.errorMessage}</div>

            <div className="cell large-7">
              <label>DB Host URL
                <input type="text" placeholder="Set full host to DB here" defaultValue={config.databaseHost}/>
              </label>
            </div>

            <div className="cell large-3">
              <label>Token
                <input type="text" placeholder="Set security token" defaultValue={config.databaseToken}/>
              </label>
            </div>

            <div className="cell large-2">
              <label>Year
                <select defaultValue={config.year}>
                  {yearOptions}
                </select>
              </label>
            </div>
          </div>

          <div className="cell">
            <input type="submit" className="button" value="Submit"/>
          </div>
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps)(ConfigForm);
