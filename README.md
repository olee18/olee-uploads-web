# olee-uploads-web

ເວັບແອັບອັບໂຫລດ ແລະ ຈັດເກັບໄຟລ໌ມີເດຍ (ຮູບ, ວິດີໂອ, ສຽງ) ແບບງ່າຍໆ ຂຽນດ້ວຍ HTML, CSS ແລະ JavaScript ລ້ວນ ບໍ່ຕ້ອງໃຊ້ server ຫຼື framework ໃດໆ — ໄຟລ໌ທັງໝົດເກັບໄວ້ໃນ browser ຂອງຜູ້ໃຊ້ເອງຜ່ານ IndexedDB.

## ຄຸນສົມບັດ

- **ເຂົ້າສູ່ລະບົບ** ພ້ອມຕົວເລືອກ "ຈື່ຂ້ອຍໄວ້" (localStorage / sessionStorage)
- **ອັບໂຫລດໄຟລ໌** ໂດຍລາກມາວາງ ຫຼື ກົດເລືອກ, ເລືອກໄດ້ຫຼາຍໄຟລ໌ພ້ອມກັນ ແລະ ມີແຖບສະແດງຄວາມຄືບໜ້າ
- ຮອງຮັບ **ຮູບ** (JPG, PNG, GIF, WEBP), **ວິດີໂອ** (MP4, WEBM, MOV) ແລະ **ສຽງ** (MP3, WAV, OGG) · ສູງສຸດ 50MB ຕໍ່ໄຟລ໌
- **ຄັງຂອງຂ້ອຍ**: ເບິ່ງ, ດາວໂຫລດ ແລະ ລຶບໄຟລ໌; ໄຟລ໌ແຍກຕາມຜູ້ໃຊ້ແຕ່ລະຄົນ
- **ຄົ້ນຫາ** ຕາມຊື່ໄຟລ໌ ແລະ **ກັ່ນຕອງ** ຕາມປະເພດ (ທັງໝົດ / ຮູບ / ວິດີໂອ / ສຽງ)
- **ໂໝດແຈ້ງ / ມືດ** ຈື່ຄ່າທີ່ເລືອກໄວ້ ແລະ ໃຊ້ຕາມການຕັ້ງຄ່າຂອງເຄື່ອງເປັນຄ່າເລີ່ມຕົ້ນ
- ໃຊ້ຟອນ Noto Sans Lao ແລະ ຮອງຮັບໜ້າຈໍມືຖື

## ໂຄງສ້າງໂປຣເຈັກ

```
olee-uploads-web/
├── index.html    # ໜ້າເຂົ້າສູ່ລະບົບ
├── upload.html   # ໜ້າອັບໂຫລດ ແລະ ຄັງໄຟລ໌
├── login.js      # ກວດສອບຜູ້ໃຊ້ ແລະ ເກັບ session
├── upload.js     # ອັບໂຫລດ, ສະແດງ, ຄົ້ນຫາ, ລຶບໄຟລ໌ (IndexedDB)
├── theme.js      # ສະຫຼັບໂໝດແຈ້ງ / ມືດ
├── icons.js      # ໄອຄອນ SVG
├── style.css     # ສະໄຕລ໌ທັງໝົດ
└── favicon.svg
```

## ວິທີໃຊ້ງານ

1. Clone ໂປຣເຈັກ

   ```bash
   git clone https://github.com/olee18/olee-uploads-web.git
   cd olee-uploads-web
   ```

2. ເປີດ `index.html` ໃນ browser ໄດ້ເລີຍ, ຫຼື ແລ່ນ local server ເຊັ່ນ:

   ```bash
   python3 -m http.server 8000
   ```

   ແລ້ວເຂົ້າ <http://localhost:8000>

3. ເຂົ້າສູ່ລະບົບດ້ວຍບັນຊີທົດສອບ ເຊັ່ນ `admin` / `123`

> **ໝາຍເຫດ:** ນີ້ເປັນໂປຣເຈັກສຳລັບຝຶກຫັດ. ລາຍຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານຂຽນໄວ້ໃນ `login.js` ຝັ່ງ client ຈຶ່ງບໍ່ປອດໄພສຳລັບໃຊ້ງານຈິງ. ໄຟລ໌ທີ່ອັບໂຫລດຈະຢູ່ໃນ browser ເຄື່ອງນັ້ນເທົ່ານັ້ນ ຖ້າລຶບຂໍ້ມູນ browser ໄຟລ໌ກໍຈະຫາຍ.

## ເຕັກໂນໂລຢີ

- HTML5, CSS3, Vanilla JavaScript
- IndexedDB (ເກັບໄຟລ໌), localStorage / sessionStorage (session ແລະ ທີມ)
- Google Fonts — Noto Sans Lao
