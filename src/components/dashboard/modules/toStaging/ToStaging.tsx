import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../../../reducers';

interface myProps extends RouteComponentProps<{}> {
    WrappedComponent: any;
}
class ToStaging extends Component<myProps,any> {
    render() {
        return (
            <div>
                ●	Cohorts/batches about to move to staging
            </div>
        )
    }
}
const mapStateToProps = (state: IState) => ({
    auth: state.managementState.auth
});

export default connect(mapStateToProps)(ToStaging);
