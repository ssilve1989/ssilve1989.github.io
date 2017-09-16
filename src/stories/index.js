import React from 'react';

import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';
import Header from '../components/Header/index';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Header', module).add('default', () => <Header />);
