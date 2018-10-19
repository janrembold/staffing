import React, {Component} from 'react';
import store from '../../store';
import {closeProject} from '../../store/thunks';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import ProjectStaffingDetail from './ProjectStaffingDetail';
import DescriptionList from '../descriptionList/DescriptionList';
import StaffingForm from '../staffing/StaffingForm';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import './react-tabs.css';
import {getProjectStatusByKey} from '../../staffing/projectStatus';

class ProjectListItem extends Component {
  constructor(props) {
    super(props);

    this.handleCloseProject = this.handleCloseProject.bind(this);
    this.openDetailsAndShowStaffingTab = this.openDetailsAndShowStaffingTab.bind(this);
    this.toggleDetail = this.toggleDetail.bind(this);

    this.state = {
      isClosing: false,
      isDetailVisible: false,
      tabIndex: 0
    };
  }

  handleCloseProject(e) {
    e.preventDefault();

    if (window.confirm(`Really close project "${this.props.project.name}"?`)) {
      this.setState({isClosing: true});
      store.dispatch(closeProject(this.props.project.id));
    }
  }

  openDetailsAndShowStaffingTab(e) {
    e.preventDefault();
    this.setState({
      isDetailVisible: true,
      tabIndex: 2
    });
  }

  toggleDetail(e) {
    e.preventDefault();
    this.setState({
      isDetailVisible: !this.state.isDetailVisible
    });
  }

  getStaffedDays(project) {
    return project.staffings.reduce((acc, val) => acc + val.days, 0)
  }

  createProjectDescriptionList(project) {
    const descriptions = [];
    const addToList = (title, description, condition = true) => {
      if (condition) {
        descriptions.push({title, description});
      }
    };

    const staffedDays = this.getStaffedDays(project);
    let timing = `Week ${project.startWeek}`;
    if (project.startWeek !== project.endWeek) {
      timing += ` - ${project.endWeek}`;
    }

    addToList('Timing', timing);
    addToList('Staffing', `${project.estimationDays} days (${staffedDays} days staffed) ${staffedDays > project.estimationDays ? '❗' : ''}`);
    addToList('Project number', `${project.number}`, project.number);
    addToList('Project Manager', `${project.manager}`, project.manager);
    addToList('Favored Developer', `${project.developer}`, project.developer);
    addToList('Status', getProjectStatusByKey(project.status));

    return descriptions;
  }

  render() {
    const {project} = this.props;
    const {isClosing, isDetailVisible, tabIndex} = this.state;

    if (isClosing) {
      return (
        <div className="projectListItem callout">
          <div>Project is closing...</div>
        </div>
      );
    }

    const descriptions = this.createProjectDescriptionList(project);
    const staffedDays = this.getStaffedDays(project);

    return (
      <div className="projectListItem callout">

        <button className="projectListItem__closeButton close-button" onClick={this.handleCloseProject} type="button">
          <span aria-hidden="true">&times;</span>
        </button>

        <div className="projectListItem__title">
          <button className="projectListItem__toggleDetailButton" onClick={this.toggleDetail} type="button">
            {isDetailVisible ? '-' : '+'}
          </button>
          {staffedDays >= project.estimationDays ? '' : (
            <a className="projectListItem__staffButton button small small-only-expanded success"
               onClick={this.openDetailsAndShowStaffingTab}>Staff
            </a>
          )}
          <span className="projectListItem__name" onClick={this.toggleDetail}>
            {staffedDays > project.estimationDays ? '❗' : ''}
            {project.customer} - {project.name}
          </span>

          <Link to={{pathname: '/project', state: {projectId: project.id}}} className="projectListItem__editLink"> <span role="img" aria-label="edit project">✏️</span></Link>
        </div>

        <div className={`projectListItem__${isDetailVisible ? 'detailVisible' : 'detailHidden'}`}>
          <Tabs selectedIndex={tabIndex} onSelect={tabIndex => this.setState({tabIndex})}>
            <TabList>
              <Tab>Facts</Tab>
              <Tab>Details</Tab>
              <Tab>
                Staffing ({staffedDays} of {project.estimationDays} days)
              </Tab>
            </TabList>

            <TabPanel>
              <DescriptionList items={descriptions}/>
            </TabPanel>
            <TabPanel>
              <p>{project.description}</p>
            </TabPanel>
            <TabPanel>
              <StaffingForm project={project}/>
              <ProjectStaffingDetail staffings={project.staffings} project={project} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

ProjectListItem.propTypes = {
  project: PropTypes.object
};

export default ProjectListItem;
