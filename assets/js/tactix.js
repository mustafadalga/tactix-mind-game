var taslar = [];
var zincirBaglimi = true;
var zincirCaprazmi = false;
var oyuncu1 = "";
var oyuncu2 = ""
var kuraSonuc = 0;
var aktifOyuncu = 0;
$(document).ready(function () {

  $(document).on("click", ".btn-oyunu-baslat", function () {

    $(".modal-kura-cekimi").slideUp();
    $.notify("Yeni oyun başladı", "success");

    if (kuraSonuc == 1) {
      $(".bg-sol .aktif-oyuncu").removeClass("d-none");
      aktifOyuncu = 1;
    } else {
      $(".bg-sag .aktif-oyuncu").removeClass("d-none");
      aktifOyuncu = 2;
    }
    $(".btn-kura-cek button").attr("disabled", false);
  });


  $(document).on("click", ".btn-kura-cek button", function () {

    $(this).attr('disabled', true);
    var adSoyad = "";
    kuraSonuc = kuraCek();

    if (kuraSonuc == 1) {
      adSoyad = $(".profil-1 > h3").text();

    } else {
      adSoyad = $(".profil-2 > h3").text();
    }
    $(".modal-kura-cekimi  .modal-footer").append("<div class='modal-alert alert-success'>Oyuna başlayacak oyuncu:" + adSoyad + "</div >");
    $(".modal-kura-cekimi  .modal-footer").append("<button type='button' class='btn btn-primary btn-oyunu-baslat'>Oyunu Başlat</button>");

  });


  $(".btn-oyun-baslat").click(function () {

    oyuncu1 = $('input[name="oyuncu_1"]').val().toUpperCase();
    oyuncu2 = $('input[name="oyuncu_2"]').val().toUpperCase();

    if (!isEmpty(oyuncu1, oyuncu2)) {

      $(".oyuncu-1-gosterge .oyuncu-ad").html(oyuncuAdBoslukBirak(oyuncu1));
      $(".oyuncu-2-gosterge .oyuncu-ad").html(oyuncuAdBoslukBirak(oyuncu2));
      $(".profil-1 > h3").text(oyuncu1);
      $(".profil-2 > h3").text(oyuncu2);
      $(".modal-oyuncu-girisi").slideUp();
      $(".modal-kura-cekimi").slideDown();


    } else {

      $(".modal-oyuncu-girisi  .modal-warning").html("<div class='modal-alert alert-danger'>Lütfen boş alanları doldurunuz</div >");
      setTimeout(function () {
        $(".alert-danger").slideUp();
      }, 3000);

    }

  });


  $(".tas-kaldir").click(function () {

    var kaldirilacakTasSayisi = $(".kaldirilacak-tas").length;
    if (kaldirilacakTasSayisi > 0) {
      hamleYapilsinmi();
    } else {
      $.notify("Oynamak için taş seçmediniz !", "warn");
    }
  });

  $(document).on("click", ".modal-yeni-oyun .close", function () {
    $(".modal-yeni-oyun").slideUp();

  });

  $(document).on("click", ".yeni-oyun", function () {

    oyunVerileriniSifirla();
    $(".modal-kura-cekimi").addClass("modal-yeni-oyun");
    $(".modal-kura-cekimi").slideDown();
  });


  $(".tas").click(function () {

    var tas = $(this);
    satir = tasSatirSutunGetir(tas)[0];
    sutun = tasSatirSutunGetir(tas)[1];
    tasOynat(tas)


    if (taslar.length > 1) {
      zincirBaglimi = zincirBaglimiKontrol(satir, sutun);
    }

    if (taslar.length == 2) {
      zincirCaprazmi = zincirCaprazmiKontrol(satir, sutun);
    }

    if (zincirBaglimi && !zincirCaprazmi) {

      if (taslar.length > 2) {
        checksatirsutun(satir, sutun);
      }
    } else {
      taslariGonder();
    }
  });

});


/* FONKSIYONLAR */

function zincirBaglimiKontrol(satir, sutun) {

  satirResult = Math.abs(taslar[taslar.length - 2].satir - satir);
  sutunResult = Math.abs(taslar[taslar.length - 2].sutun - sutun);

  if (satirResult < 2 && sutunResult < 2) {
    return true
  } else {
    return false
  }
}

function zincirCaprazmiKontrol(satir, sutun) {
  if ((taslar[0].satir == satir || taslar[0].sutun == sutun)) {

    return false;
  }
  else {
    return true;
  }
}

function tasKaldir(tas, satir, sutun) {

  taslar.push({
    "satir": satir,
    'sutun': sutun
  });
  tas.addClass("tas-bg-transparent");
  tas.children().addClass("tas-opacity");
  tas.parent().addClass("kaldirilacak-tas");
}

function oyuncuAdBoslukBirak(isim) {
  return isim.split(" ").join("<p></p>");
}

function tasYerineKoy(tas, satir, sutun) {

  var index = taslar.findIndex(taslar => taslar.satir === satir && taslar.sutun === sutun);
  taslar.splice(index, 1);
  tas.removeClass("tas-bg-transparent");
  tas.children().removeClass("tas-opacity");


  tas.parent().removeClass("kaldirilacak-tas");

}


function hamleYapilsinmi() {

  $.confirm({
    title: 'Karar',
    content: 'Hamle yapmak istediğinizden emin misiniz ?',
    type: 'dark',
    useBootstrap: false,
    boxWidth: '40%',
    typeAnimated: true,
    buttons: {
      yes: {
        action: function () {
          hamleYap();
        }
      },
      no: {
        action: function () {
        }
      },
    }
  });
}


function hamleYap() {

  $(".kaldirilacak-tas").addClass("kaldirilan-tas");
  $(".kaldirilan-tas").removeClass("kaldirilacak-tas");

  if (oyunTamamlandimi()) {

    oyunSonucAnimasyonGoster(aktifOyuncu);
    $(this).attr('disabled', true);

  } else {


    if (aktifOyuncu == 1) {
      $(".oyuncu-2-gosterge").addClass("oyuncu-2-gosterge-hamle");
      setTimeout(function () { $(".oyuncu-2-gosterge").removeClass("oyuncu-2-gosterge-hamle"); }, 1000);

      $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-right-to-left');
      if ($(".bg-sag .aktif-oyuncu").hasClass("d-none")) {
        $(".bg-sag .aktif-oyuncu").removeClass("d-none");
      }
      $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');

      aktifOyuncu = 2;
    } else {
      $(".oyuncu-1-gosterge").addClass("oyuncu-1-gosterge-hamle");
      setTimeout(function () { $(".oyuncu-1-gosterge").removeClass("oyuncu-1-gosterge-hamle"); }, 1000);
      $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-left-to-right');
      if ($(".bg-sol .aktif-oyuncu").hasClass("d-none")) {
        $(".bg-sol .aktif-oyuncu").removeClass("d-none");
      }
      $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');
      aktifOyuncu = 1;
    }
    taslar = [];
  }

}

function tasSatirSutunGetir(tas) {

  return [tas.attr("data-satir"), tas.attr("data-sutun")];

}

function tasOynat(tas) {

  satir = tasSatirSutunGetir(tas)[0];
  sutun = tasSatirSutunGetir(tas)[1];

  if (tas.hasClass("tas-bg-transparent")) {
    tasYerineKoy(tas, satir, sutun);
  } else {
    tasKaldir(tas, satir, sutun);
  }

}

function taslariSifirla(satir, sutun) {

  $('[data-satir=' + satir + '][data-sutun=' + sutun + ']').removeClass("tas-bg-transparent");
  $('[data-satir=' + satir + '][data-sutun=' + sutun + ']').children().removeClass("tas-opacity");
  $('[data-satir=' + satir + '][data-sutun=' + sutun + ']').parent().removeClass("kaldirilacak-tas");
}

function taslariGonder() {
  taslar.forEach(element => taslariSifirla(element.satir, element.sutun));
  taslar = [];
  zincirBaglimi = true;
  zincirCaprazmi = false;
}

function oyunTamamlandimi() {
  var tasSayisi = $(".kaldirilan-tas").length;
  if (tasSayisi == 16) {
    return true;
  } else {
    return false;
  }
}

function kimKazandi(aktifOyuncu) {

  if (aktifOyuncu == 1) {
    return 2
  } else {
    return 1
  }
}

function oyunSonucAnimasyonGoster(aktifOyuncu) {

  if (kimKazandi(aktifOyuncu) == 1) {

    $.notify(
      "Oyunu kazanan oyuncu:" + oyuncu1, { className: "success", position: "top center" },
    );

    $(".bg-sol .aktif-oyuncu img").attr("src", "assets/img/winner.png");
    $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');

    $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-left-to-right');


    setTimeout(function () {
      $(".bg-sag .aktif-oyuncu img").attr("src", "assets/img/loser.png");
      $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');
    }, 1000);



  } else {

    $.notify(
      "Oyunu kazanan oyuncu:" + oyuncu2, { className: "success", position: "top center" },
    );

    $(".bg-sag .aktif-oyuncu img").attr("src", "assets/img/winner.png");
    $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');

    $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-right-to-left');


    setTimeout(function () {
      $(".bg-sol .aktif-oyuncu img").attr("src", "assets/img/loser.png");
      $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');
    }, 1000);


  }
}

function oyunSonucAnimasyonGizle() {

  $(".bg-sol").removeClass("sol-infinite-animation");
  $(".bg-sag").removeClass("sag-infinite-animation");
}

function degiskenVerileriniSifirla() {

  taslar = [];
  zincirBaglimi = true;
  zincirCaprazmi = false;
  kuraSonuc = 0;
  aktifOyuncu = 0;
}

function oyunVerileriniSifirla() {

  $(".sutun").removeClass("kaldirilan-tas");
  $(".tas").removeClass("tas-bg-transparent");
  $(".tas").children().removeClass("tas-opacity");
  $(".tas-kaldir").attr("disabled", false);
  $(".btn-btn-kura-cek button").attr("disabled", false);
  $(".modal-kura-cekimi .modal-footer").html('');

  $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');
  $(".bg-sol .aktif-oyuncu").addClass("d-none");
  $(".bg-sol .aktif-oyuncu img").attr("src", "assets/img/active-user.png");
  $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');
  $(".bg-sag .aktif-oyuncu").addClass("d-none");
  $(".bg-sag .aktif-oyuncu img").attr("src", "assets/img/active-user.png");



  oyunSonucAnimasyonGizle();
  degiskenVerileriniSifirla();


}


function checksatirsutun(satir, sutun) {

  if (!((taslar[0].satir == satir || taslar[0].sutun == sutun) && (taslar[1].satir == satir || taslar[1].sutun == sutun))) {

    taslariGonder();

  }
  else {
    //
  }
}

function isEmpty(input1, input2) {


  if ($.trim(input1) && $.trim(input2)) {
    return false;
  } else {
    return true;
  }
}

function kuraCek() {
  return Math.floor(Math.random() * 2) + 1;
}