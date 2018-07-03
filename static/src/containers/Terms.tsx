import { connect } from 'react-redux'
import Terms from '../components/Terms'
import * as allModule from '../modules/all'

function mapStateToProps(state: allModule.State) {
  return {
    terms: state.terms
  }
}

export default connect(mapStateToProps)(Terms)
