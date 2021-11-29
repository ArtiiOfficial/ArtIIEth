/*eslint-disable*/
import React, { useState, useEffect } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";
import termsandcondition from 'assets/pdf/Artii-Terms&Conditions.pdf';
import splitownership from 'assets/pdf/Art-Split-Ownership.pdf';
import { sociallinksfunction } from '../../actions/v1/report';

import imgs from "../../assets/images/banner_light.jpg";
import imgdark from "../../assets/images/banner.jpg";
import { getsettdataAction } from "actions/v1/token";

const useStyles = makeStyles(styles);

export default function Footer(props) {
	const classes = useStyles();
	const { whiteFont } = props;
	const [settings, setSetting] = useState([]);

	const [sociallinks, setsociallinks] = useState({});
	const footerClasses = classNames({
		[classes.footer]: true,
		[classes.footerWhiteFont]: whiteFont
	});
	const aClasses = classNames({
		[classes.a]: true,
		[classes.footerWhiteFont]: whiteFont
	});

	const toggletheme = () => {

		document.getElementById("root").classList.toggle('light_theme');
		var usebody = document.getElementsByClassName("mobile_nav");
		var roottheme = document.getElementById("root");
		// console.log(roottheme.classList.contains("light_theme"),"ROOT TYHME");
		if (roottheme.classList.contains("light_theme")) {
			localStorage.setItem("theme", 'light_theme');

		}
		else {
			localStorage.setItem("theme", 'dark_theme');

		}
		// console.log("usebody",usebody);
		for (var j = 0; j < usebody.length; j++) {
			usebody[j].classList.toggle('light_theme')
		}



		var usebody = document.getElementsByClassName("mobile_nav");
		console.log(usebody, "usebody home");
		for (var j = 0; j < usebody.length; j++) {
			usebody[j].classList.toggle('light_theme')
		}




		if (location.pathname == "/my-items") {

			if (document.getElementById("root").classList.contains('light_theme')) {
				document.getElementById("items_bg_img").src = imgs;
			}
			else {
				document.getElementById("items_bg_img").src = imgdark;
			}
		}





	};
	useEffect(() => {
		getSocialLink()
	}, []);
	const getSocialLink = async () => {
		var sociadLinkdata = await getsettdataAction();
		console.log('>>>>>>>sociadLinkdata', sociadLinkdata);
		if (sociadLinkdata && sociadLinkdata.data && sociadLinkdata.data.userValue) {
			console.log('>>>>>sociadLinkdata', sociadLinkdata.data.userValue);
			setSetting(sociadLinkdata.data.userValue);
		}
	}

	return (
		<div className='footerSecs'>
			<footer className={footerClasses}>
				<div className="container">
					<div className="row pb-4">
						<div className="col-12 col-md-6 col-lg-3 mt-3 mt-lg-0">
							<span className="img-fluid logo_przn" alt="Shape" />

							{/* <img src={require("../../assets/images/lgo.png")} class="img-fluid" alt="Shape"/> */}
							{/* <img src={require("../../assets/images/footer_log_text.png")} class="img-fluid footer_logo footer_text_change" alt="Shape"/> */}

							{/* <p className="footer_big_text">The New Creative Economy.</p> */}
							<div className="theme_switch_bg">
								<li className="swithcj_li">
									<div className="d-flex justify-content-between align-items-center heade_switch">
										<div>
											<span className="hsder_ul_spn">Dark theme</span>
										</div>
										<label className="switch toggle_custom">
											<input type="checkbox" onChange={toggletheme} />
											<span className="slider"></span>
										</label>
									</div>

								</li>
							</div>
						</div>
						<div className="col-12 col-md-6 col-lg-3 offset-lg-1 mt-3 mt-lg-4">
							<p className="footer_heade">ARTII</p>
							<ul className="footer_ul">
							
								{/* <li>
            <Link to="/create">Create item</Link>
            </li> */}
								<li>
									<Link to="/artwork">Artwork</Link>
								</li>
								<li>
									<Link to="/kingdom">Kingom</Link>
								</li>
								<li>
									<Link to="/somiart">Somiart</Link>
								</li>
								<li>
									<Link to="/metaverse">Metaverse</Link>
								</li>
								<li>
									<Link to="/wlfw">WLFW</Link>
								</li>
							</ul>

						</div>
						<div className="col-12 col-md-6 col-lg-3 mt-3 mt-lg-4">
							<p className="footer_heade">Info</p>
							<ul className="footer_ul">
								<li>
									<a href="http://artiifoundation.org" target="_blank">About Us</a>
								</li>
								<li>
									<a href="http://www.artiifoundation.org/artii-whitepaper-en.pdf" target="_blank">Whitepaper</a>
								</li>
								<li>
									<Link to="/partners">Partners</Link>
								</li>
								<li>
									<Link to="/Discover">Discover</Link>
								</li>
								<li>
									<Link to="/connect-wallet">Connect wallet</Link>
								</li>
							</ul>

						</div>
						<div className="col-12 col-md-6 col-lg-2 mt-3 mt-lg-4">
							<p className="footer_heade">Social</p>
							<ul className="footer_ul">
								<li>
									<a href={settings && settings.Twitter || "#"} target="_blank">Twitter</a>
								</li>
								<li>
									<a href={settings && settings.Telegram || "#"} target="_blank">Telegram</a>
								</li>
								<li>
									<a href={settings && settings.Instagram || "#"} target="_blank">Medium</a>
								</li>
								<li>
									<a href={settings && settings.Reddit || "#"} target="_blank">Youtube</a>
								</li>
								<li>
									<a href="#" target="_blank">Github</a>
								</li>
							</ul>

						</div>
					
					
					</div>


				</div>
			</footer>
			<hr className="hr_hrey my-0" />

			<footer className={footerClasses + " py-0"}>
				<div className="container">


					<div className="row py-4 copy text-center">
						<div className="col-12 col-md-4">
							<p className="copyright_txt mb-md-0">Copyright © {new Date().getFullYear()} ARTII INC. All rights reserved</p>
						</div>
						<div className="col-12 col-md-4">
							<a href="#">info@artii.org</a>
						</div>
						<div className="col-12 col-md-4">
							<ul>
								<li>
									<a target="_blank" href={termsandcondition}>Terms & Condition</a>
								</li>
								<li>
									<a target="_blank" href={splitownership}>Split Ownership</a>
								</li>
							</ul>
						</div>
						<div className="col-12 col-md-6">
							{/* <p className="copyright_txt text-md-right mb-md-0">We use cookies for better service.
        <span className="pl-2 accept_text_foor">
          Accept
          </span>
          </p>   */}
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

Footer.propTypes = {
	whiteFont: PropTypes.bool
};
