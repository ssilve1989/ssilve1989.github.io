import React from 'react';
import Skill from './Skill';
import './Skills.css';

const Skills = props => {
  const className = `${props.className || ''} Skills`;
  return (
    <section className={className}>
      <h1 className="Experience-header">My Professional Skills</h1>
      <Skill className="Skill skill-1" knowledge={95} skill="Front End">
        <p>
          Proficient in creating Object Oriented JavaScript applications. I have used various JS
          frameworks including jQuery, AngularJS 1.x, and most recently React. I am a huge proponent
          of the Flux architecture and React and most my time recently is spent on these
          technologies.
        </p>
      </Skill>
      <Skill className="Skill skill-2" knowledge={85} skill="Back End">
        <p>
          More often than not, I work in a full-stack role and have built systems involving numerous
          languages. Some of my strongest skills lie in Node.JS and JVM oriented languages like
          Groovy and Java. Learning new languages comes fairly easy to me.
        </p>
      </Skill>
      <Skill className="Skill skill-3" knowledge={75} skill="Design">
        <p>
          As a Full Stack Developer for Web Applications, I often find that I also need to propose
          UI/UX solutions as there often may not be a dedicated person available.
        </p>
      </Skill>
    </section>
  );
};

export default Skills;
