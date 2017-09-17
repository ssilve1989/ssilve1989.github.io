import React from 'react';
import PropTypes from 'prop-types';
import './Timeline.css';

const Timeline = ({ timeline }) => {
	const renderTimelineItem = ({ icon, company, position, time }) => (
		<li>
			<div className="Timeline-Badge">
				<i className={ icon } />
			</div>
			<div className="Timeline-Panel">
				<p className="Timeline-Time">
					<i className="fa fa-clock-o" />
					{ time }
				</p>
				<div className="Timeline-Heading">
					<h3>{ company }</h3>
					<h6>{ position }</h6>
				</div>
			</div>
		</li>
	);

	return (
		<section className="Timeline">
			<ul>
				{ timeline.map(renderTimelineItem) }
			</ul>
		</section>
	)
};

Timeline.propTypes = {
	timeline: PropTypes.arrayOf(PropTypes.shape({
		company : PropTypes.string.isRequired,
		position: PropTypes.string.isRequired,
		icon    : PropTypes.string.isRequired,
		time    : PropTypes.string.isRequired
	}))
}

export default Timeline;