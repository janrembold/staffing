import React, { Component } from 'react';
import { connect } from "react-redux";
import ProjectListItem from './ProjectListItem';
import './projectListItem.css';
import { getProjectStatusByKey, NEW, SEARCH, WAITFEEDBACK, HOLD, BLOCKER, ACTIVE } from '../../staffing/projectStatus';

const mapStateToProps = state => {
  const projects = state.data.projects;
  return { projects };
};

class Projects extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      filter: ''
    };
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      filter: e.target.getAttribute('data-filter')
    });
  }

  render() {
    const {filter} = this.state;
    const addFilterItem = (key) => {
      let count = 0;
      let text = key;

      if(key !== 'ALL') {
        count = this.props.projects.filter(p => p.status === key).length;
        text = getProjectStatusByKey(key);
      } else {
        count = this.props.projects.filter(p => !p.closed).length;
        text = 'All';
      }

      const content = count > 0 ? (<a onClick={this.handleClick} data-filter={key}>{text} ({count})</a>) : `${text} (${count})`;
      return (<li key={key}>{content}</li>);
    };

    const filterItems = [
      addFilterItem('ALL'),
      addFilterItem(NEW),
      addFilterItem(SEARCH),
      addFilterItem(WAITFEEDBACK),
      addFilterItem(HOLD),
      addFilterItem(BLOCKER),
      addFilterItem(ACTIVE)
    ];

    const projects = this.props.projects.filter(p => !filter || filter === 'ALL' || p.status === filter);

    return (
      <div className="projects">
        <div className="grid-x grid-padding-x">
          <div className="cell medium-2">
            <ul className="projects__filterList">
              {filterItems}
            </ul>
          </div>
          <div className="cell medium-10">
            {projects.map(project => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Projects);
