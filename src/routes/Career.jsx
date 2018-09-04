import React from 'react';
import Timeline from '../components/Timeline/index';
import ScrollTop from '../components/ScrollTop';

const timeline = [
  {
    company: 'TruMid',
    position: 'JavaScript Engineer',
    time: 'Jan 2018 - Present',
    icon: 'fa fa-line-chart',
  },
  {
    company: 'TuringsCraft Inc.',
    position: 'Software Engineer',
    time: 'Feb 2016 - Jan 2018',
    icon: 'fa fa-code',
  },
  {
    company: 'Digital Reasoning',
    position: 'Professional Services Engineer',
    time: 'Aug 2015 - Feb 2016',
    icon: 'fa fa-user-secret',
  },
  {
    company: 'Mount Sinai Health System',
    position: 'Senior Web Applications Developer',
    time: 'Oct 2014 - Aug 2015',
    icon: 'fa fa-h-square',
  },
  {
    company: 'The Mount Sinai Hospital',
    position: 'Web / Java Developer',
    time: 'Jun 2013 - Oct 2014',
    icon: 'fa fa-hospital-o',
  },
];

const Career = () => (
  <article style={{ padding: '1em' }}>
    <section className="text-center">
      <h1>Professional Timeline</h1>
      <h5>Constantly growing and delivering quality code</h5>
    </section>
    <section>
      <Timeline timeline={timeline} />
    </section>
  </article>
);

export default ScrollTop(Career);
