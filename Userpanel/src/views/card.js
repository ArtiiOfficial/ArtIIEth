import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import config from '../lib/config';
import { Link, useHistory, useLocation } from "react-router-dom";
import { LazyLoad } from "react-lazyload";
import Lazyloader from '../views/lazyloader'
import isEmpty from "lib/isEmpty";
import {
	getCurAddr
  } from '../actions/v1/user';
  
  import {
	TokenCounts_Get_Detail_Action,
	BidApply_ApproveAction,
	acceptBId_Action,
	CancelBid_Action
  } from '../actions/v1/token';
  

export default function Card(props) {
	const rest = props.item;
	const history = useHistory();

	var {
        item,
        LikedTokenList,
        hitLike,
        UserAccountAddr,
        UserAccountBal,
        PlaceABid_Click,
        PutOnSale_Click,
		CancelBid_Select,
        PurchaseNow_Click,
        WalletConnected
    } = props;
	console.log('>>>>>>item',item);
    const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>
        } else {
            return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
        }
    };

	useEffect(() => {
		// TokenCounts_Get_Detail_Call( { tokenCounts : item.tokenCounts } );
	} , [])
	return (
		(item.tokenowners_current) ?
			<div className={props.addClass || "col-12 col-md-6 col-lg-4 mb-4"}>
				<div>
					<div className="img_overlay toptext">
						<div className="d-flex justify-content-between pos_top">
							{/* {
								item && 
								item.tokenowners_current && 
								item.tokenowners_current.tokenPrice && 
								item.tokenowners_current.tokenPrice > 0 && 
								UserAccountAddr !== item.tokenOwner ?  
								<span className="badge badge-green-purchase ml-3" onClick={() => PurchaseNow_Click(item)} >purchasing</span> 
								: 
								item
								&& item.tokenBid == true
								&& item.clocktime != null
								&& item.endclocktime != null
								&&
								((new Date(item.endclocktime)) > (Date.now())) &&
								<Button className="create_btn create_btn_lit mb-2">
									Action Not Complete Yet
								</Button>
							}
							{
								item
								&& item.tokenBid == true
								&& item.clocktime != null
								&& item.endclocktime != null
								&&
								((new Date(item.endclocktime)) < (Date.now())) &&
								(item.tokenowners_current.tokenPrice == 0 || item.tokenowners_current.tokenPrice == null) && <span className="badge badge-green-purchase ml-3" onClick={() => PutOnSale_Click()} >Put On Sale</span>

							} */}

							<span className="badge badge_black_round mr-3" onClick={() => hitLike(item)}>
							{
								(LikedTokenList.findIndex(tokenCounts => (tokenCounts.tokenCounts === item.tokenCounts)) > -1) ?
								(<i className="fas fa-heart mr-2 liked"></i>):
								(<i className="far fa-heart mr-2"></i>)
							}
							<span class={item.tokenCounts+'-likecount'}>{item.likecount}</span>
							</span>
						</div>
						<div className="pos_top_artist">
							 { item.tokenOwnerInfo && item.tokenOwnerInfo.name && <p className="mb-0 d-flex">
							<span className="artist_name">{ item.tokenOwnerInfo.name }</span>
							<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
							</p> }
						</div>
						{/* <div className="text-center pos_bot">
						{(( item
							&& item.tokenBid==true
							&& item.clocktime != null
							&& item.endclocktime != null
							&& new Date(item.endclocktime) < Date.now()) ?
							( <p className="mt-0 media_text_big_1 text-center">Waiting for owner to Accept</p> )
							: 
							!isEmpty(item.bidingsList) ? 
							(item.bidingsList && item.bidingsList.status === 'pending' && <Link to = {`/info/${item.tokenCounts}`}><Button className="create_btn"><span className="font_12">Edit a bid </span><i class="fas fa-signal ml-2"></i></Button></Link>)  ||
							(item.bidingsList && item.bidingsList.status === 'partiallyCompleted' && <Link to = {`/info/${item.tokenCounts}`}><Button className="create_btn"><span className="font_12">Cancel a bid </span><i class="fas fa-signal ml-2"></i></Button></Link>)
							:
							(<Link to = {`/info/${item.tokenCounts}`}><Button className="create_btn"><span className="font_12">Place a bid </span><i class="fas fa-signal ml-2"></i></Button></Link>)
							// (<Link to = {`/info/${item.tokenCounts}`}><span className="font_12">Place a bid </span><i class="fas fa-signal ml-2"></i></Link>)
							)
							}
						</div> */}
							<Link to = {`/info/${item.tokenCounts}`}>
							
						<div className="img_col_md">
							{/* <img src={require("../assets/images/nature_3.jpg")} class="img-fluid img_radius" alt="Shape"/> */}
							{
								item.image != "" && (item.image.split('.').pop() == "mp4" ?
								<video
										id="my-video"
										class="img-fluid img_info"
										autoPlay playsInline loop muted
										preload="auto"
										// poster={item.ipfsimage!=""?`${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
										data-setup="{}"
								>
								<source src={ !isEmpty(item.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenCreator}/${item.additionalImage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" />
								</video>	
								:
								<img src = { !isEmpty(item.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenCreator}/${item.additionalImage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="User" className="img-fluid img_radius" onClick = { () => {history.push({pathname : `/info/${rest.tokenCounts}`, state : { 'item' : rest }})}}/>
								)
							}
						</div>
							</Link>
					</div>
				<div className="media mt-3">
					<div className="media-body flex_body flex_body_start flex_grid_div">
						<div>
							<p className="mt-0 banner_desc_user">{ rest.tokenName }</p>
							<div class="d-flex creators_details">
								<Link to = {item.tokenCreatorInfo.curraddress && `/my-items/${item.tokenCreatorInfo.curraddress}`}><img src={item.tokenCreatorInfo.image && `${config.Back_URL}/images/${item.tokenCreatorInfo.curraddress}/${item.tokenCreatorInfo.image}` ||  require('../assets/images/noimage.png')} alt="User" className="img-fluid align-self-center" /></Link>
								<Link to = {item.tokenOwnerInfo.curraddress && `/my-items/${item.tokenOwnerInfo.curraddress}`}><img src={item.tokenOwnerInfo.image && `${config.Back_URL}/images/${item.tokenOwnerInfo.curraddress}/${item.tokenOwnerInfo.image}` ||  require('../assets/images/noimage.png')} alt="User" className="img-fluid align-self-center" /></Link>
								{/* <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" /> */}
							</div>
						</div>
						<div className="text-center">
							<a href={ config.bscscan +  item.tokenowners_current.tokenOwner} target="_blank"><img src={require("../assets/images/BscScan-logo-circle.png")} alt="User" className="img-fluid align-self-center bscscan-img" /></a>
						</div>
						<div className="stock_desc">
							{item.tokenowners_current && item.tokenowners_current.tokenPrice > 0 && <p class="badge badge-green-full mb-2">{item.tokenowners_current.tokenPrice} { config.currencySymbol }</p>} 
							<p className="mt-0 banner_desc_user">{ item.tokenowners_current && item.tokenowners_current.balance && item.tokenowners_current.balance } in stock</p>
						</div>
					</div>
				</div>
				<hr className="hr_grey" />

				{item.bidingsList &&  <div className="media-body flex_body">
					<p className="hot_bid_sm_text lates_tetx font_12">
						<span className="pr-1">Highest bid</span>
						<span className="bid_txt_1">{ item.bidingsList.tokenBidAmt } { config.currencySymbol }</span>
					</p>
					<p className="hot_bid_sm_text lates_tetx font_12">
						<span className="pr-1">New bid</span>
					</p>
				</div>  }
			</div>
		</div>
		: ('')
	)
}