import React from 'react';
import Scroll from 'react-scroll';

const ScrollTop = Component => class extends React.Component {
	componentWillMount() {
		const scroll = Scroll.animateScroll
		scroll.scrollToTop({
			smooth     : 'easeInOutQuad',
			duration   : 1500,
			to         : '.RouteContainer',
			containerId: '#root'
		})
	}

	render() {
		return <Component { ...this.props }/>
	}
}

export default ScrollTop;