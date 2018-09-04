import React from 'react';
import './About.css';

const About = props => {
  const className = `${props.className || ''} About container-fluid`;
  return (
    <article className={className}>
      <header>
        <h1>About me</h1>
        <h5 className="quote">Motivated Full Stack Engineer</h5>
      </header>
      <div className="row">
        <div className="col-md-4">
          <div className="row">
            <div className="col-sm-1 col-md-3">
              <i className="fa fa-2x fa-gears" />
            </div>
            <div className="col-sm-11 col-md-9">
              <h5 className="title">Efficient</h5>
              <p className="small">
                I am always looking on how to improve the performance of code. I often research or
                run performance tests to both understand why a particular method is better and also
                how to implement it
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="row">
            <div className="col-sm-1 col-md-3">
              <i className="fa fa-2x fa-bar-chart-o" />
            </div>
            <div className="col-sm-11 col-md-9">
              <h5 className="title">Self-Driven</h5>
              <p className="small">
                I am constantly striving to improve my knowledge and am never done learning. I often
                explore the latest trends in software development, particularly in the JavaScript
                realm
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="row">
            <div className="col-sm-1 col-md-3">
              <i className="fa fa-2x fa-clock-o" />
            </div>
            <div className="col-sm-11 col-md-9">
              <h5 className="title">Timely</h5>
              <p className="small">
                I am accustomed to the fast-paced work-style of startups and large companies alike
                where results are desired quickly. I am able to meet these requirements while
                maintaining a balance of delivering quality work within the time constraints
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default About;
