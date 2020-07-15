import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import './top-card.css'

class TopCard extends React.Component {
    // static propTypes = {
    //     pathLink: PropTypes.string.isRequired,
    //     iconClassName: PropTypes.string.isRequired,
    //     CardMainTitle: PropTypes.string.isRequired,
    //     CardSubTitle: PropTypes.string.isRequired,
    //     bgColor: PropTypes.string.isRequired,
    // };


    render() {
        const {bgColor, pathLink, iconClassName, CardMainTitle, CardSubTitle} = this.props;
        return (
            <div className='cell' style={bgColor}>
                <Link className='cell-content' to={pathLink ? pathLink : '/'}>
                    <span className={iconClassName}/>
                    <h4>{CardMainTitle}</h4>
                    <h5>{CardSubTitle}</h5>
                </Link>
            </div>
        )
            ;
    }

}

export default withRouter(TopCard)