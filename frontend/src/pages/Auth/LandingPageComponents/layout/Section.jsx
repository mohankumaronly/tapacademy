import React from 'react';
import PropTypes from 'prop-types';
import LandingPageLayout from '../../../../layouts/LandingPageLayout';

const Section = ({ children, className = '', bgWhite = false, id = '' }) => {
  return (
    <section 
      id={id}
      className={`relative z-10 ${bgWhite ? 'bg-white' : ''} ${className}`}
    >
      <LandingPageLayout>{children}</LandingPageLayout>
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bgWhite: PropTypes.bool,
  id: PropTypes.string
};

export default Section;