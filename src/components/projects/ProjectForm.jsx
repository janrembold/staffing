import React, { Component } from 'react';
import { getWeekNumber } from '../../staffing/dateHelper';
import { PROJECT_STATUS, getProjectStatusByKey } from '../../staffing/projectStatus';
import { addProject, updateProject } from '../../store/thunks';
import store from '../../store';
import PropTypes from 'prop-types';
import {config} from '../../config';
import './projectForm.css';
import {validateFormElement} from "../../staffing/formHelper";

const defaultState = {
  data: {
    id: '',
    year: config.year,
    customer: '',
    name: '',
    number: '',
    status: PROJECT_STATUS.NEW,
    manager: '',
    developer: '',
    description: '',
    estimationDays: '',
    startWeek: getWeekNumber(),
    endWeek: '',
    closed: false,
    staffings: []
  },
  app: {
    newProjectWasCreated: false
  }
};

class ProjectForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = { ...defaultState };
    if(props.location.state && props.location.state.projectId) {
      const projectForUpdate = store.getState().data.projects.find(p => props.location.state.projectId === p.id);
      if(projectForUpdate) {
        this.state.data = projectForUpdate;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.data.id) {
      store.dispatch(updateProject(this.state.data));
      this.props.history.push('/');
    } else {
      store.dispatch(addProject({...this.state.data }));
      this.setState({
        ...defaultState,
        app: {
          ...defaultState.app,
          newProjectWasCreated: true
        }
      });
    }
  }

  handleChange(event) {
    const inputName = event.target.name;
    const value = validateFormElement(event.target.value, event.target.getAttribute('data-parse'));

    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [inputName]: value
      }
    });
  }

  componentDidUpdate() {
    if (this.state.data.endWeek && this.state.data.endWeek < this.state.data.startWeek) {
      this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          endWeek: null
        }
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.newProjectWasCreatedTimeout);
  }

  render() {
    const { id, customer, name, manager, developer, description, number, status, estimationDays, startWeek, endWeek } = this.state.data;
    const { newProjectWasCreated } = this.state.app;
    const isSubmitDisabled = !(customer && name && estimationDays && startWeek && endWeek);
    let newProjectWasCreatedInfo = '';

    const startingWeekOptions = Array.from(Array(52).keys()).map(index => {
      const week = index + 1;
      return <option key={week} value={week}>{week}</option>;
    });

    const endingWeekOptions = [<option key="0" value="">Select End Week</option>];
    if (startWeek) {
      for (let week = startWeek; week <= 52; week++) {
        endingWeekOptions.push(<option key={week} value={week}>{week}</option>)
      }
    }

    const addStatusOption = (key) => (<option key={key} value={key}>{getProjectStatusByKey(key)}</option>);
    const statusOptions = [ addStatusOption('NEW') ];
    if(id) {
      statusOptions.push(addStatusOption('SEARCH'));
      statusOptions.push(addStatusOption('WAITFEEDBACK'));
      statusOptions.push(addStatusOption('HOLD'));
      statusOptions.push(addStatusOption('BLOCKER'));
      statusOptions.push(addStatusOption('ACTIVE'));
    }

    if(newProjectWasCreated) {
      newProjectWasCreatedInfo = <span className="projectForm__success"><span role="img" aria-label="">👍</span> Project was saved</span>;

      this.newProjectWasCreatedTimeout = setTimeout(() => {
        if(this.state.app.newProjectWasCreated) {
          this.setState({
            ...this.state,
            app: {
              ...this.state.app,
              newProjectWasCreated: false
            }
          });
        }
      }, 6000);
    }

    return (
      <form className="projectForm">
        <input type="hidden" name="id" value={id} />
        <div className="grid-container">

          <div className="grid-x grid-padding-x">
            <div className="cell">
              <h4>{id ? `Edit project #${id}` : `Create new project`}</h4>
            </div>

            <div className="cell">
              <label>Customer *
                <input
                  name="customer"
                  onChange={this.handleChange}
                  value={customer}
                  type="text"
                  placeholder="Customer name"
                  required
                />
              </label>
            </div>

            <div className="medium-6 cell">
              <label>Project Name *
                <input
                  name="name"
                  onChange={this.handleChange}
                  value={name}
                  type="text"
                  placeholder="Project name"
                  required
                />
              </label>
            </div>

            <div className="medium-3 cell">
              <label>Project Number
                <input
                  name="number"
                  onChange={this.handleChange}
                  value={number}
                  type="text"
                  placeholder="Teambox project number"
                />
              </label>
            </div>

            <div className="medium-3 cell">
              <label>Project Status
              <select
                  name="status"
                  onChange={this.handleChange}
                  value={status}
                >
                  {statusOptions}
                </select>
              </label>
            </div>

            <div className="medium-6 cell">
              <label>Project Manager
                <input
                  name="manager"
                  onChange={this.handleChange}
                  value={manager}
                  type="text"
                  placeholder="Project Manager name"
                />
              </label>
            </div>

            <div className="medium-6 cell">
              <label>Favored Developer
                <input
                  name="developer"
                  onChange={this.handleChange}
                  value={developer}
                  type="text"
                  placeholder="Favored Developer name"
                />
              </label>
            </div>

            <div className="cell">
              <label>Description
                <textarea
                  name="description"
                  onChange={this.handleChange}
                  value={description}
                  placeholder="Additional informations about the project like Jira/Confluence/VSTS Links..."
                  style={{ height: '10rem' }}
                ></textarea>
              </label>
            </div>

            <div className="medium-4 cell">
              <label>Estimated working days *
                <input
                  name="estimationDays"
                  onChange={this.handleChange}
                  value={estimationDays}
                  type="number"
                  step="0.25"
                  placeholder="Days"
                  data-parse="float"
                  required
                />
              </label>
            </div>

            <div className="medium-4 cell">
              <label>Starting Week *
                <select
                  name="startWeek"
                  onChange={this.handleChange}
                  value={startWeek}
                  data-parse="integer"
                  required
                >
                  {startingWeekOptions}
                </select>
              </label>
            </div>

            <div className="medium-4 cell">
              <label>Ending Week *
                <select
                  name="endWeek"
                  onChange={this.handleChange}
                  value={endWeek}
                  disabled={!startWeek}
                  data-parse="integer"
                  required
                >
                  {endingWeekOptions}
                </select>
              </label>
            </div>
          </div>

          <div className="button-group">
            <input
              disabled={isSubmitDisabled}
              onClick={this.handleSubmit}
              type="submit"
              className="button"
              value="Submit"
            />
            {newProjectWasCreatedInfo}
          </div>

          <p className="help-text">* Required fields</p>
        </div>
      </form>
    );
  }
}

ProjectForm.propTypes = {
  project: PropTypes.object
};

export default ProjectForm;
