import React from 'react';
import PropTypes from 'prop-types';
import './TextScroller.css';

class TextScroller extends React.Component {
  static propTypes = {
    fixed: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    this.start();
  }

  start = () => setInterval(this.scroller, 3500);

  scroller = () => {
    let { index } = this.state;
    const { values } = this.props;
    index = index === values.length - 1 ? 0 : index + 1;
    this.setState({ shrink: true });
    this.scrollerTimeout = setTimeout(() => this.setState({ index, shrink: false }), 500);
  };

  render() {
    const { values, fixed, className = '', ...rest } = this.props;
    const { index, shrink } = this.state;
    const value = values[index];
    return (
      <div className={`${className} TextScroller`} {...rest}>
        {!!fixed && <span className="Fixed">{fixed}</span>}
        <span className={`Scroller ${shrink ? 'shrink' : ''}`}>{value}</span>
      </div>
    );
  }
}

export default TextScroller;
