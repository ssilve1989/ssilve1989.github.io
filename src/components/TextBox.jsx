import React from 'react';

const TextBox = ({ value, ...rest }) => <div {...rest}>{value}</div>;

export default TextBox;
