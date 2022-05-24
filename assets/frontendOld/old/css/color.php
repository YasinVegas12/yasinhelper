<?php
header ("Content-Type:text/css");
$color = "#ea0117"; // Change your Color Here

function checkhexcolor($color) {
  return preg_match('/^#[a-f0-9]{6}$/i', $color);
}

if( isset( $_GET[ 'color' ] ) AND $_GET[ 'color' ] != '' ) {
  $color = "#" . $_GET[ 'color' ];
}

if( !$color OR !checkhexcolor( $color ) ) {
  $color = "#ea0117";
}

?>

.boxed-btn,
.boxed-btn:hover,
.faq-area .right-content-wrapper .card .card-header a[aria-expanded="true"]:after,
.faq-area .left-content-wrapper .card .card-header a[aria-expanded="true"]:after,
.submit-btn,
.marketing-area .marekting-inner .subscribe-form .submit-btn:hover,
.back-to-top,
.navbar-area .right-btn-wrapper .boxed-btn:hover,
.login-page-area .login-form-wrapper .btn-wrapper .left-content .submit-btn:hover,
.contact-page-container .contact-form .submit-btn:hover,
.blog-details-page-conent .single-blog-details-post .content .blockquote
{
background-color: <?php echo $color; ?>;

}

.navbar-area .right-btn-wrapper .boxed-btn:hover
{
border: 2px solid #fff;
}

.faq-area .right-content-wrapper .card .card-header a:after,
.faq-area .left-content-wrapper .card .card-header a:after,
.checkbox-inner .checkmark,
.checkbox-inner .checkmark:after
{
border-color: <?php echo $color; ?>;
}

.faq-area .right-content-wrapper .card .card-header a:after,
.faq-area .left-content-wrapper .card .card-header a:after,
.icon-hover > a > i:hover,
.footer-area .footer-widget .widget-body ul li a:hover,
.login-page-area .login-form-wrapper .btn-wrapper .right-content .anchor:hover,
.login-page-area .login-form-wrapper .from-footer a,
.blog-page-conent .single-blog-post .content .title:hover,
.blog-page-conent .single-blog-post .content .readmore:hover
{
color: <?php echo $color; ?>;
}

.navbar-area.nav-fixed {

	background-color: <?php echo $color; ?>;
}

.video-area.grd-overlay::after {
	background-color: <?php echo $color; ?>;
}



.achivement-area .single-achivement-item .number {
	-webkit-text-fill-color: <?php echo $color; ?>;
}



.boxed-btn.btn-rounded:hover {
	/*background: #fff;*/
	color:  #fff;
}
















