$(document).ready(function () {
    $(".details-chk").change(function () {
        var targetId = $(this).data("target");
        if ($(this).is(":checked")) {
            $("#" + targetId).show();
        } else {
            $("#" + targetId).hide();
        }
    });

    $("#btnProceed").click(function () {
        var checkedCars = $(".select-chk:checked");
        if (checkedCars.length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل للمتابعة");
            return;
        }
        $("#formContainer").show();
        $('html, body').animate({
            scrollTop: $("#formContainer").offset().top
        }, 300);
    });
});

function handleRentalSubmit() {
    var fullName = document.getElementById("fullName").value.trim();
    var nationalId = document.getElementById("nationalId").value.trim();
    var startDateVal = document.getElementById("startDate").value;
    var endDateVal = document.getElementById("endDate").value;
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();

    var valid = true;

    $(".error-message").hide();

    if (fullName !== "") {
        var namePattern = /^[\u0621-\u064A\s]+$/;
        if (!namePattern.test(fullName)) {
            $("#errFullName").text("يجب إدخال أحرف هجائية عربية فقط").show();
            valid = false;
        }
    }

    if (nationalId === "") {
        $("#errNationalId").text("الرقم الوطني إلزامي الإدخال").show();
        valid = false;
    } else {
        var idPattern = /^(0[1-9]|1[0-4])[0-9]{9}$/;
        if (!idPattern.test(nationalId)) {
            $("#errNationalId").text("يجب أن يتألف من 11 خانة وأن يبدأ برمز محافظة صحيح بين 01 و 14").show();
            valid = false;
        }
    }

    if (startDateVal === "") {
        $("#errStartDate").text("تاريخ بداية التأجير إلزامي").show();
        valid = false;
    }

    if (endDateVal === "") {
        $("#errEndDate").text("تاريخ نهاية التأجير إلزامي").show();
        valid = false;
    }

    var rentalDays = 0;
    if (startDateVal !== "" && endDateVal !== "") {
        var sDate = new Date(startDateVal);
        var eDate = new Date(endDateVal);
        var diffTime = eDate.getTime() - sDate.getTime();
        rentalDays = Math.ceil(diffTime / (1000 * 3600 * 24));

        if (rentalDays <= 0) {
            $("#errEndDate").text("يجب أن يكون تاريخ النهاية لاحقاً لتاريخ البداية").show();
            valid = false;
        }
    }

    if (phone !== "") {
        var phonePattern = /^(093|094|095|096|098|099)[0-9]{7}$/;
        if (!phonePattern.test(phone)) {
            $("#errPhone").text("رقم الموبايل يجب أن يطابق شبكتي Syriatel أو MTN وبطول 10 أرقام").show();
            valid = false;
        }
    }

    if (email !== "") {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $("#errEmail").text("صيغة البريد الإلكتروني غير صحيحة").show();
            valid = false;
        }
    }

    if (!valid) {
        return false;
    }

    var totalCostBeforeDiscount = 0;
    var carListHtml = "<ul>";

    $(".select-chk:checked").each(function () {
        var cName = $(this).data("name");
        var cPrice = parseInt($(this).data("price"), 10);
        var itemTotal = cPrice * rentalDays;

        totalCostBeforeDiscount += itemTotal;
        carListHtml += "<li>" + cName + " (أجرة اليوم: " + cPrice + " ل.س) - الإجمالي: " + itemTotal + " ل.س</li>";
    });
    carListHtml += "</ul>";

    var finalAmount = totalCostBeforeDiscount;
    var discountHtml = "";

    if (rentalDays > 7) {
        var discountAmount = totalCostBeforeDiscount * 0.10;
        finalAmount = totalCostBeforeDiscount - discountAmount;
        discountHtml = "<p class='discount-text'>تم تطبيق خصم 10% لتجاوز مدة الحجز 7 أيام (قيمة الخصم: " + discountAmount + " ل.س)</p>";
    } else {
        discountHtml = "<p>لم يطبق أي خصم (المدة لم تتجاوز 7 أيام)</p>";
    }

    var resultHtml = "<h3>ملخص طلب التأجير</h3>";
    resultHtml += "<p><strong>الاسم:</strong> " + (fullName === "" ? "غير محدد" : fullName) + "</p>";
    resultHtml += "<p><strong>الرقم الوطني:</strong> " + nationalId + "</p>";
    resultHtml += "<p><strong>عدد أيام التأجير:</strong> " + rentalDays + " يوم</p>";
    resultHtml += "<p><strong>السيارات المختارة:</strong></p>" + carListHtml;
    resultHtml += "<p><strong>المجموع قبل الخصم:</strong> " + totalCostBeforeDiscount + " ل.س</p>";
    resultHtml += discountHtml;
    resultHtml += "<p><strong>المبلغ الإجمالي المستحق:</strong> " + finalAmount + " ل.س</p>";

    $("#orderSummary").html(resultHtml);
    $("#resultSection").show();

    $('html, body').animate({
        scrollTop: $("#resultSection").offset().top
    }, 300);

    return false;
}