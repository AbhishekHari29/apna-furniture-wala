(function ($) {
	"use strict";

	// Spinner
	var spinner = function () {
		setTimeout(function () {
			if ($("#spinner").length > 0) {
				$("#spinner").removeClass("show");
			}
		}, 1);
	};
	spinner();

	// Initiate the wowjs
	new WOW().init();

	// Sticky Navbar
	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$(".sticky-top").addClass("shadow-sm").css("top", "0px");
		} else {
			$(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
		}
	});

	// Back to top button
	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$(".back-to-top").fadeIn("slow");
		} else {
			$(".back-to-top").fadeOut("slow");
		}
	});
	$(".back-to-top").click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
		return false;
	});

	// Brands Slider
	$(document).ready(function () {
		if ($(".brands_slider").length) {
			var brandsSlider = $(".brands_slider");

			brandsSlider.owlCarousel({
				loop: true,
				autoplay: true,
				autoplayTimeout: 2000,
				nav: false,
				dots: false,
				autoWidth: true,
				items: 8,
				margin: 42
			});

			if ($(".brands_prev").length) {
				var prev = $(".brands_prev");
				prev.on("click", function () {
					brandsSlider.trigger("prev.owl.carousel");
				});
			}

			if ($(".brands_next").length) {
				var next = $(".brands_next");
				next.on("click", function () {
					brandsSlider.trigger("next.owl.carousel");
				});
			}
		}
	});

	// Facts counter
	$('[data-toggle="counter-up"]').counterUp({
		delay: 10,
		time: 2000
	});

	// Header carousel
	$(".header-carousel").owlCarousel({
		autoplay: true,
		smartSpeed: 1500,
		items: 1,
		dots: true,
		loop: true,
		nav: true,
		navText: [
			'<i class="bi bi-chevron-left"></i>',
			'<i class="bi bi-chevron-right"></i>'
		]
	});

	// Testimonials carousel
	$(".testimonial-carousel").owlCarousel({
		autoplay: true,
		smartSpeed: 1000,
		center: true,
		dots: false,
		loop: true,
		nav: true,
		navText: [
			'<i class="bi bi-arrow-left"></i>',
			'<i class="bi bi-arrow-right"></i>'
		],
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 2
			}
		}
	});

	// Portfolio isotope and filter
	var portfolioIsotope = $(".portfolio-container").isotope({
		itemSelector: ".portfolio-item",
		layoutMode: "fitRows"
	});
	$("#portfolio-flters li").on("click", function () {
		$("#portfolio-flters li").removeClass("active");
		$(this).addClass("active");

		portfolioIsotope.isotope({ filter: $(this).data("filter") });
	});
})(jQuery);

function LoadFile(event) {
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.onload = function (e) {
		console.log(e.target.result);
		var fileData = e.target.result.substr(e.target.result.indexOf(",") + 1);
		var mimeTypeStart = e.target.result.indexOf("data:") + 5;
		var mimeTypeEnd = e.target.result.indexOf(";");
		var mimeType = e.target.result.substr(
			mimeTypeStart,
			mimeTypeEnd - mimeTypeStart
		);
		var fileName = file.name;
		document.getElementById("fileData").value = fileData;
		document.getElementById("mimeType").value = mimeType;
		document.getElementById("fileName").value = fileName;
	};
	reader.readAsDataURL(file);
}

/**
 * Initiate portfolio lightbox
 */
const portfolioLightbox = GLightbox({
	selector: ".portfolio-lightbox"
});

/**
 * Initiate portfolio details lightbox
 */
const portfolioDetailsLightbox = GLightbox({
	selector: ".portfolio-details-lightbox",
	width: "90%",
	height: "90vh"
});

/**
 * Portfolio details slider
 */
new Swiper(".portfolio-details-slider", {
	speed: 400,
	loop: true,
	autoplay: {
		delay: 5000,
		disableOnInteraction: false
	},
	pagination: {
		el: ".swiper-pagination",
		type: "bullets",
		clickable: true
	}
});

// Form Handling

const scriptURL =
	"https://script.google.com/macros/s/AKfycbz5pNnVEaF3ZHmDUYcsHi24Y-DpSdhgCdM94qWlDwWGfzBgQTBhYnq6a_Jul74WVWc58A/exec"; // v1.0.2
const mailURL = "https://formsubmit.co/ajax/apnafurniturewalaa@gmail.com";

const quoteForm = document.forms["quote-form"];

quoteForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const submitBtn = quoteForm.elements["quote-submit-btn"];
	submitBtn.disabled = true;
	submitBtn.textContent = "Loading...";

	const popup = Notification({
		position: "top-right",
		duration: 3000
	});

	const name = quoteForm["name"].value;
	const email = quoteForm["email"].value;
	const phone = quoteForm["phone"].value;
	const service = quoteForm["service"].value;

	var validated = true;
	var errorTitle = "Invalid Input",
		errorMessage = "";
	if (!validator.isAlpha(name)) {
		errorMessage = "Name contains only Alphabets";
		validated = false;
	} else if (!validator.isEmail(email)) {
		errorMessage = "Invalid Email address";
		validated = false;
	} else if (!validator.isMobilePhone(phone, "en-IN")) {
		errorMessage = "Invalid Phone Number";
		validated = false;
	} else if (validator.isEmpty(service)) {
		errorMessage = "Select a Service";
		validated = false;
	}

	if (validated) {
		const formData = new FormData(quoteForm);

		// Upload to GoogleSheets
		await fetch(scriptURL, { method: "POST", body: formData })
			.then((response) => console.log(response.ok))
			.catch((error) => console.log(error));

		const removeFields = ["fileData", "mimeType", "fileName"];
		const formObj = Object.fromEntries(formData);
		Object.keys(formObj).forEach((key) => {
			if (removeFields.includes(key)) delete formObj[key];
		});

		// Send Email
		fetch(mailURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify(formObj)
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.log(error));

		popup.success({
			title: "Thank You",
			message: "We will contact you soon!"
		});

		quoteForm.reset();
	} else {
		popup.error({
			title: errorTitle,
			message: errorMessage
		});
	}
	submitBtn.disabled = false;
	submitBtn.textContent = "Submit";
});

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// if(urlParams.has('thankyou')) {
// 	const popup = Notification({
// 		position: 'top-right',
// 		duration: 3000
// 	  });

// 	  popup.success({
// 		title: 'Thank You',
// 		message: 'We will contact you soon!'
// 	  });
// }
