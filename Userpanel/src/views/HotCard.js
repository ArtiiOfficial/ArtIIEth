import React, { useState } from "react";
import { Button } from "@material-ui/core";
import config from '../lib/config';
import { Link, useHistory, useLocation } from "react-router-dom";
import isEmpty from "lib/isEmpty";

export default function Card(props) {
	const rest = props.item;
	const history = useHistory();
	var {
        item,
        LikedTokenList,
        hitLike,
		PutOnSale_Click,
        UserAccountAddr,
        PurchaseNow_Click,
    } = props;
    const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>
        } else {
            return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
        }
    };
	console.log('>>>>>>>>Log item',item);
	return (
			<div>
				<div className="img_overlay toptext">
						<div className="d-flex justify-content-between pos_top">
							{/* {
								item.tokenownerslist.curr.tokenPrice > 0 && UserAccountAddr !== item.tokenOwner && <span className="badge badge-green-purchase ml-3" onClick={() => PurchaseNow_Click(item.tokenownerslist.curr)} >purchasing</span>
							}
							{
								item.tokenownerslist.curr.tokenPrice === 0 && UserAccountAddr !== item.tokenOwner && <span className="badge badge-green-purchase ml-3" onClick={() => PutOnSale_Click(item.tokenownerslist.curr)} >Put On Sale</span>
							} */}
							<span className="badge badge_black_round mr-3" onClick={() => hitLike(item.tokenownerslist)}>
								{
									(LikedTokenList.findIndex(tokenCounts => (tokenCounts.tokenCounts === item.tokenownerslist.tokenCounts)) > -1) ?
									(<i className="fas fa-heart mr-2 liked"></i>):
									(<i className="far fa-heart mr-2"></i>)
								}
								<span class={item.tokenownerslist.tokenCounts+'-likecount'}>{item.tokenownerslist.curr.likecount}</span>
							</span>
						</div>
						<div className="pos_top_artist">
							<p className="mb-0 d-flex">
								<span className="artist_name">{item.tokenownerslist.curr.tokenName}</span>
								<img src={require("../assets/images/large-profile-tick.png")} class="img-fluid atist_ver" />
							</p>
						</div>
						{/* <div className="text-center pos_bot">
							<Link to = {`/info/${item.tokenownerslist.tokenCounts}`} ><Button className="create_btn"><span className="font_12">Place a bid</span><i class="fas fa-signal ml-2"></i></Button></Link>
						</div> */}
						<div className="img_col_md">
							{/* <img src={`${config.Back_URL}/nftImg/${item.tokenownerslist.curr.tokenOwner}/${item.tokenownerslist.curr.image}`} class="img_hover img-fluid img_radius" alt="Shape"/> */}
							<Link to={`/info/${item.tokenownerslist.tokenCounts}`}>
                    {
                            item.image!=""&&(item.tokenownerslist.curr.image.split('.').pop() == "mp4" ?
							<video
									id="my-video"
									class="img-fluid img_info"
									autoPlay playsInline loop muted
									preload="auto"
									// poster={item.ipfsimage!=""?`${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
									data-setup="{}"
								>
								<source src={ !isEmpty(item.tokenownerslist.curr.additionalImage) ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenownerslist.curr.tokenCreator}/${item.tokenownerslist.curr.additionalImage}` : `${config.Back_URL}/nftImg/${item.tokenownerslist.curr.tokenCreator}/${item.tokenownerslist.curr.image}`} type="video/mp4" />
							</video>
                                    :
                                    <img src={ !isEmpty(item.tokenownerslist.curr.additionalImage)  ? `${config.Back_URL}/nftImg/compressedImage/${item.tokenownerslist.curr.tokenCreator}/${item.tokenownerslist.curr.additionalImage}` : `${config.Back_URL}/nftImg/${item.tokenownerslist.curr.tokenCreator}/${item.tokenownerslist.curr.image}`} alt="Collections" className="img_hover img-fluid img_radius" />
                             ) 
                    }
                    </Link>
						</div>
				</div>
				<div className="media mt-3">
				<div className="media-body flex_body flex_body_start flex_grid_div">
					<div>
						<p className="mt-0 banner_desc_user">{ item.tokenownerslist.curr.tokenName }</p>
						<div class="d-flex creators_details">
							{/* <img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
							<img src={require("../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
							<img src={require("../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" /> */}
						</div>
					</div>
					<div className="text-center">
						<a href={config.bscscan + item.tokenownerslist.curr.tokenCreator} target="_blank"><img src={require("../assets/images/BscScan-logo-circle.png")} alt="User" className="img-fluid align-self-center bscscan-img" /></a>
					</div>
					<div className="stock_desc">
						<p class="badge badge-green-full mb-2">{item.tokenownerslist.curr.tokenPrice} { config.currencySymbol }</p>
						<p className="mt-0 banner_desc_user stock_list">{ item.tokenownerslist.curr.balance } in stock</p>
					</div>
				</div>
			</div>
			<hr className="hr_grey" />
			{/* <div className="media-body flex_body">
				<p className="hot_bid_sm_text lates_tetx font_12">
				<span className="pr-1">Highest bid</span>
				<span className="bid_txt_1">0.001 BNB</span>
				</p>
				<p className="hot_bid_sm_text lates_tetx font_12">
				<span className="pr-1">New bid</span>
				</p>
			</div> */}
		</div>
	)
}