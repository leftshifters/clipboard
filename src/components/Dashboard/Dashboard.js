import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './Dashboard.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Row from '../Row';
import UploadBox from '../UploadBox';

@withStyles(Styles)
class Dashboard {
  get FileUploadForm() {
    return (
      <div className="col-lg-3 col-xs-12 col-md-4 col-sm-6 item-row">
       <UploadBox />
      </div>
    );
  }

  render() {
    return (
      <Row>
        {this.FileUploadForm}
      </Row>
    );
  }
}

export default Dashboard;
