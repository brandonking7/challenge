import React, { Component } from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as listingActionCreators from "../actions/listingActions";
let listingData = require('../listingData.json');
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

class Listings extends Component {
  componentDidMount() {
    this.props.actions.listings.setListings(listingData);
  }

  render() {
    return (
      <div className="main">
        {this.props.listings ? (
          <div className="grid">
            {this.props.listings.map((listing, index) => {
              return (
                <div key={index} className="card">
                  {listing.showBridge ? (
                    <img
                      className="card-bridgeImg"
                      src={require("../assets/wide_ggbridge_bg_teneax.jpg")}
                    />
                  ) : (
                    <div className="card-img-container">
                      <img
                        className="card-img-container-backgroundImg"
                        src={require("../assets/darktiles_bg_gike55.jpg")}
                      />
                      <img
                        className="card-img-container-placeholderImage"
                        src={require("../assets/place_holder_zuvywg.png")}
                      />
                    </div>
                  )}
                  <div className="card-info">
                    <div className="card-info-row">
                      <div className="card-info-row-heading">
                        {listing.Heading}
                      </div>
                      <div className="card-info-row-subheading">
                        {listing.Subheading}
                      </div>
                    </div>

                    <div className="card-info-footer">
                      <div className="card-info-footer-line" />
                      <div className="card-info-footer-price">
                        {formatter.format(listing.Price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Loading listings</div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    listings: state.listings
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: {
      listings: bindActionCreators(listingActionCreators, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Listings)
