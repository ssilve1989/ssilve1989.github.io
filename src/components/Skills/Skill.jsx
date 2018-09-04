import React from 'react';
import PropTypes from 'prop-types';
import './Skill.css';
import ProgressCircle from '../ProgressCircle/ProgressCircle';

const Skill = props => {
  const className = `${props.className || ''} Skill`;
  const { skill, knowledge } = props;
  return (
    <div className={className}>
      <ProgressCircle progress={knowledge} text={`${knowledge}%`} />
      <h4>{skill}</h4>
      {props.children}
    </div>
  );
};

Skill.propTypes = {
  knowledge: PropTypes.number,
  skill: PropTypes.string.isRequired,
};

export default Skill;
