var taslar = [];
var zincirBaglimi = true;
var zincirCaprazmi = false;
var oyuncu1 = "";
var oyuncu2 = ""
var kuraSonuc = 0;
var aktifOyuncu = 0;
var solSkor = 0;
var sagSkor = 0;
var durum=true;

$(document).ready(function () {

  modalEffect();

  $(".btn-ilerle").click(function () {

   
    oyuncu1 = checkInput($('input[name="oyuncu_1"]').val()).toUpperCase();
    oyuncu2 = checkInput($('input[name="oyuncu_2"]').val()).toUpperCase();

    if (!isEmpty(oyuncu1, oyuncu2)) {
      modalEffect();
      $(".oyuncu-1-gosterge .oyuncu-ad").html(oyuncuAdBoslukBirak(oyuncu1));
      $(".oyuncu-2-gosterge .oyuncu-ad").html(oyuncuAdBoslukBirak(oyuncu2));
      $(".profil-1 > h3").html(oyuncu1);
      $(".profil-2 > h3").html(oyuncu2);
      $(".modal-oyuncu-girisi").slideUp();
      $(".modal-kura-cekimi").slideDown();

    } else {

      $(".modal-oyuncu-girisi  .modal-warning").html("<div class='modal-alert alert-danger'>Lütfen boş alanları doldurunuz</div >");
      setTimeout(function () {
        $(".alert-danger").slideUp();
      }, 3000);
    }
  });

  $(document).on("click", ".btn-kura-cek button", function () {

    $(this).attr('disabled', true);
    var adSoyad = "";
    kuraSonuc = kuraCek();

    if (kuraSonuc == 1) {
      adSoyad = $(".profil-1 > h3").html();
    } else {
      adSoyad = $(".profil-2 > h3").html();  
    }
    $(".modal-kura-cekimi  .modal-footer").append("<div class='modal-alert alert-success'>Oyuna başlayacak oyuncu:" + adSoyad + "</div >");
    $(".modal-kura-cekimi  .modal-footer").append("<button type='button' class='btn btn-primary btn-oyun-baslat'>Oyunu Başlat</button>");

  });


  $(document).on("click", ".btn-oyun-baslat", function () {

    $(".hucre").removeClass("kaldirilan-tas");
    $(".tas").removeClass("tas-bg-transparent");
    $(".tas").children().removeClass("tas-opacity");
    
    if(durum){
      $(".sol-skor").addClass("bounceInDown opacity-1");
      $(".sag-skor").addClass("bounceInDown opacity-1");
      durum=false;
    }

    taslariYerineKoy();
    $(".modal-kura-cekimi").slideUp();

    $.notify("Yeni oyun başladı", "success");

    if (kuraSonuc == 1) {
      $(".bg-sol .aktif-oyuncu").removeClass("d-none");
      $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');
    } else {
      $(".bg-sag .aktif-oyuncu").removeClass("d-none");
      $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');
    }
    aktifOyuncu=kuraSonuc;
    $(".btn-kura-cek button").attr("disabled", false);
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

  $(document).on("click", ".btn-yeni-oyun", function () {

    modalEffect();
    oyunVerileriniSifirla();
    $(".modal-kura-cekimi").addClass("modal-yeni-oyun");
    $(".modal-kura-cekimi").slideDown();
  });


  $(".tas").click(function () {

    var tas = $(this);
    satir = tasSatirSutunGetir(tas)[0];
    sutun = tasSatirSutunGetir(tas)[1];

    if (taslar.length > 0) {
      zincirBaglimi = taslarBaglantiliMi(tas, satir, sutun);
    }
    tasOynat(tas);

    if (taslar.length == 2) {
      zincirCaprazmi = zincirCaprazmiKontrol(satir, sutun);
    }

    if (zincirBaglimi && !zincirCaprazmi) {

      if (taslar.length > 2) {
        checkSatirSutun(satir, sutun);
      }
    } else {
      taslariGonder();
    }
  });

});


/* FONKSIYONLAR */

function taslariYerineKoy() {

  $('[data-satir=4]').addClass("satir-4-yerlestir");
  $('[data-satir=3]').addClass("satir-3-yerlestir");
  $('[data-satir=2]').addClass("satir-2-yerlestir");
  $('[data-satir=1]').addClass("satir-1-yerlestir");
}

function taslariYerindenKaldir() {

  $('[data-satir=4]').removeClass("satir-4-yerlestir");
  $('[data-satir=3]').removeClass("satir-3-yerlestir");
  $('[data-satir=2]').removeClass("satir-2-yerlestir");
  $('[data-satir=1]').removeClass("satir-1-yerlestir");
}

function taslarBaglantiliMi(tas, satir, sutun) {

  if (tasSecildimi(tas)) {

    var secilmisTasSayisi = taslar.length;
    if (secilmisTasSayisi == 3) {

      var sutunFark = Math.abs(taslar[1].sutun - sutun);
      var satirFark = Math.abs(taslar[1].satir - satir);
      if (satirFark == 0 && sutunFark == 0) {
        return false;
      } else {
        return true;
      }
    } else if (secilmisTasSayisi == 4) {

      var yatayMi = taslarYatayMiDikeyMi();

      if (yatayMi) {
        var sutunFark = Math.abs(taslar[1].sutun - sutun) == 0 || Math.abs(taslar[2].sutun - sutun) == 0;
        if (sutunFark) {
          return false;
        }
        else {
          return true;
        }
      } else {
        var satirFark = Math.abs(taslar[1].satir - satir) == 0 || Math.abs(taslar[2].satir - satir) == 0;
        if (satirFark) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }

  } else {
    var satirFark = Math.abs(taslar[taslar.length - 1].satir - satir);
    var sutunFark = Math.abs(taslar[taslar.length - 1].sutun - sutun);
    if (satirFark < 2 && sutunFark < 2) {
      return true
    } else {
      return false
    }
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

function oyuncuAdBoslukBirak(isim) {
  return isim.split(" ").join("<p></p>");
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
      evet: {
        action: function () {
          hamleYap();
        }
      },
      hayır: {
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
    $(".tas-kaldir").attr('disabled', true);

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

function taslarYatayMiDikeyMi() {

  satirFark = Math.abs(taslar[0].satir - taslar[1].satir);
  sutunFark = Math.abs(taslar[0].sutun - taslar[1].sutun);
  if (satirFark == 1) {
    return false;
  } else if (sutunFark == 1) {
    return true;
  }
}

function tasSatirSutunGetir(tas) {
  return [tas.attr("data-satir"), tas.attr("data-sutun")];
}

function tasSecildimi(tas) {
  if (tas.hasClass("tas-bg-transparent")) {
    return true;
  } else {
    return false;
  }
}

function tasOynat(tas) {

  satir = tasSatirSutunGetir(tas)[0];
  sutun = tasSatirSutunGetir(tas)[1];

  if (tasSecildimi(tas)) {
    tasYerineKoy(tas, satir, sutun);
  } else {
    tasKaldir(tas, satir, sutun);
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

function tasYerineKoy(tas, satir, sutun) {

  var index = taslar.findIndex(taslar => taslar.satir === satir && taslar.sutun === sutun);
  taslar.splice(index, 1);
  tas.removeClass("tas-bg-transparent");
  tas.children().removeClass("tas-opacity");
  tas.parent().removeClass("kaldirilacak-tas");
}

function taslariGonder() {
  taslar.forEach(element => taslariSifirla(element.satir, element.sutun));
  taslar = [];
  zincirBaglimi = true;
  zincirCaprazmi = false;
}

function taslariSifirla(satir, sutun) {

  $('[data-satir=' + satir + '][data-sutun=' + sutun + ']').removeClass("tas-bg-transparent");
  $('[data-satir=' + satir + '][data-sutun=' + sutun + ']').children().removeClass("tas-opacity");
  $('[data-satir=' + satir + '][data-sutun=' + sutun + ']').parent().removeClass("kaldirilacak-tas");
}

function checkSatirSutun(satir, sutun) {

  if (!((taslar[0].satir == satir || taslar[0].sutun == sutun) && (taslar[1].satir == satir || taslar[1].sutun == sutun))) {
    taslariGonder();
  }
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

  let kazananNo = kimKazandi(aktifOyuncu);
  let kazananOyuncu="";
  puanGuncelle(kazananNo);

  if (kazananNo == 1) {
     kazananOyuncu=oyuncu1;
    $(".bg-sol .aktif-oyuncu img").attr("src", "assets/img/winner.png");
    $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');
    $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-left-to-right');

    setTimeout(function () {
      $(".bg-sag .aktif-oyuncu img").attr("src", "assets/img/loser.png");
      $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');
    }, 1000);

  } else {
    kazananOyuncu=oyuncu2;
    $(".bg-sag .aktif-oyuncu img").attr("src", "assets/img/winner.png");
    $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-right-to-left');
    $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-right-to-left');

    setTimeout(function () {
      $(".bg-sol .aktif-oyuncu img").attr("src", "assets/img/loser.png");
      $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-left-to-right');
    }, 1000);

  }
  $.notify("Oyunu kazanan oyuncu:" + kazananOyuncu, "success");
  
}

function puanGuncelle(kazananNo) {

  var sinifIsim = "";

  if (kazananNo == 1) {
    solSkor++;
    sinifIsim = ".sol-skor";
    puanlamaAnimasyonCalistir(sinifIsim = sinifIsim, solSkor = solSkor, sagSkor = false);
  } else {
    sagSkor++;
    sinifIsim = ".sag-skor";
    puanlamaAnimasyonCalistir(sinifIsim = sinifIsim, solSkor = false, sagSkor = sagSkor);
  }

}

function puanlamaAnimasyonCalistir(sinifIsim, solSkor, sagSkor) {

  $(sinifIsim).removeClass("bounceInDown");
  $(sinifIsim).addClass("flip");

  setTimeout(function () {

    if (sinifIsim == ".sol-skor") {
      $(sinifIsim).html(solSkor);
    } else {
      $(sinifIsim).html(sagSkor);
    }
  }, 1000);

  setTimeout(function () {
    $(sinifIsim).removeClass("flip");
  }, 3000);
}

function degiskenleriSifirla() {

  taslar = [];
  zincirBaglimi = true;
  zincirCaprazmi = false;
  kuraSonuc = 0;
  aktifOyuncu = 0;
}

function oyunVerileriniSifirla() {

  $(".tas-kaldir").attr("disabled", false);
  $(".btn-btn-kura-cek button").attr("disabled", false);
  $(".modal-kura-cekimi .modal-footer").html('');

  $(".bg-sol .aktif-oyuncu").css('animation-name', 'oyuncu1-right-to-left');
  $(".bg-sol .aktif-oyuncu img").attr("src", "assets/img/active-user.png");
  $(".bg-sag .aktif-oyuncu").css('animation-name', 'oyuncu2-left-to-right');
  $(".bg-sag .aktif-oyuncu img").attr("src", "assets/img/active-user.png");

  taslariYerindenKaldir();
  degiskenleriSifirla();

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

function randomNumber() {
  return Math.floor(Math.random() * 4) + 1;
}

function modalEffect() {
  var sayi = randomNumber();
  if (sayi == 1) {
    $(".modal").css({ 'animation-name': "modal-from-left" });
  } else if (sayi == 2) {
    $(".modal").css({ 'animation-name': "modal-from-right" });
  } else if (sayi == 3) {
    $(".modal").css({ 'animation-name': "modal-from-top" });
  } else if (sayi == 4) {
    $(".modal").css({ 'animation-name': "modal-from-bottom" });
  }
}

function checkInput(value) {
  var lt = /</g, gt = />/g, ap = /'/g, ic = /"/g;
  return value.toString().replace(lt, "").replace(gt, "").replace(ap, "").replace(ic, "");
}

