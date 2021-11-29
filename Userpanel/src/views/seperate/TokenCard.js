import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty';
import Avatars from "views/Avatar";

export default function TokenCard(props) {
    async function showAllwithPro(data) {
    }
    async function buyToken() {
        console.log('buyToken')
    }
    var {
        item,
        LikedTokenList,
        hitLike,
        UserAccountAddr,
        UserAccountBal,
        PutOnSale_Click,
        PurchaseNow_Click,
        Burn_Click,
        CancelOrder_Click,
        WalletConnected,
        ShareSocial_Click,
        SubmitReport_Click
    } = props;

    const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>
        } else {
            return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
        }
    };
    return (
        (item.tokenOwner) ?
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">
                   
        <div className="item">
            <div className="card_inner_item">
                {/* <div className="item_details_top">
                        <p className="sold_text">Sold to @mikebasker</p>
                      </div>            */}


                <div className="item_inner_img">
                    <Link to={"/info/" + item.tokenCounts}>
                    {
                            item.image!=""&&(item.image.split('.').pop() == "mp4" ?
                                    <video src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls muted playsInline loop />
                                    :
                                    <img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                             ) 
                    }
                    </Link>
                    </div>
                   

                <div className="item_details_bot">
                {/* {(item && item.clocktime != null && item.endclocktime != null) ?
                            (<badge className="badge badge-secondary">
                                <Countdown date={new Date(item.endclocktime)}
                                    autoStart={true}
                                    onStart={() => new Date(item.clocktime)}
                                    renderer={renderer}
                                >
                                </Countdown>
                                <i class="fas fa-fire ml-2"></i>
                            </badge>) : ('')} */}
                <Link to={"/info/" + item.tokenCounts}>
                 <h2>{item.tokenName}</h2></Link>
                {item.tokenowners_current.tokenOwner == UserAccountAddr && <h4 className="text-left">My Collections</h4> }    
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="media follow_media">
                            <div className="img_tick_div">
                                {/* <img src={require("../assets/images/small-profile.png")} alt="User" className="img-fluid mr-2 img_user_new_sm" /> */}
                                {/* owner */}
                                {
                                    item
                                        && item.type == 1155
                                        && item.tokenowners_current_count
                                        && item.tokenowners_current_count.count
                                        && item.tokenowners_current_count.count > 1
                                        ?
                                        ('')
                                        :
                                        (!isEmpty(item.tokenOwnerInfo) && item.tokenOwnerInfo.curraddress && item.tokenOwnerInfo.image!="")
                                            ?
                                            <a href={`${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`} title={`Owner : ${item.tokenOwnerInfo.name}`}>
                                                <img src={`${config.Back_URL}/images/${item.tokenOwnerInfo._id}/${item.tokenOwnerInfo.image}`} alt="Owner" className="img-fluid mr-2 img_user_new_sm" />
                                            </a>
                                            :
                                            <a href={`${config.Front_URL}/user/${item.tokenowners_current.tokenOwner}`} title={`Owner : ${item.tokenowners_current.tokenOwner}`}>
                                                {/* <img src={`${config.Back_URL}/images/noimage.png`} alt="Owner" className="img-fluid mr-2 img_user_new_sm" /> */}
                                                {/* <Avatars item={item.tokenowners_current.tokenOwner} className="img-fluid mr-2 img_user_new_sm"/> */}
                                                <Avatars  classValue="img-fluid mr-2 img_user_new_sm" />
                                            </a>
                                }

                            </div>
                            <div className="media-body flex_body">
                                <p className="mt-0 media_text mt-0 mb-0"  style={{"wordBreak":"break-all"}} title={item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:(item.tokenowners_current.tokenOwner)}>@{item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:((item.tokenowners_current.tokenOwner).slice(0,8).concat('....'))}</p>
                            </div>
                        </div>
                        <div>
                            
                        <h3 className="mb-0" >
                    {/* {(item.PutOnSale == false || (item.PutOnSale == true && item.PutOnSaleType=='FixedPrice' && item.tokenowners_current.tokenPrice == 0)) && <span>Not for sale </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='FixedPrice' && item.tokenowners_current.tokenPrice > 0) && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='TimedAuction') && <span>Minimum Bid </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='UnLimitedAuction') && <span>Open for Bids </span>}
                    {item.tokenowners_current.balance} of {item.tokenowners_current.quantity} */}
                    {(item.PutOnSale == true && item.PutOnSaleType=='FixedPrice' && item.tokenowners_current.tokenPrice > 0) && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='TimedAuction') && <span>{item.minimumBid} {config.tokenSymbol} </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='UnLimitedAuction') && <span>Open for Bids </span>}
                    {item.tokenowners_current.balance} of {item.tokenowners_current.quantity} 
                </h3>
                            {/* <h3    >{item.tokenowners_current.tokenPrice > 0 && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>} </h3> */}
                        </div>
                    </div>

                </div></div>

        </div>
        </div> 
        : ('')  
    )
}