let bookList = [],
  basketList = [];

// Toggle Menu
const toggleModal = () => {
  const basketModal = document.querySelector(".basket__modal");
  basketModal.classList.toggle("active");
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));
};
getBooks();

// Dinamik Yıldızlar Oluşturuldu
const createBookStars = (starRate) => {
  //   console.log(starRate);
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += ` <i class="bi bi-star-fill active"></i>`;
    } else {
      starRateHtml += ` <i class="bi bi-star-fill"></i>`;
    }
  }
  return starRateHtml;
};

// HTML oluşturuldu ve kitaplar bunun içine gönderildi
const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book__list");
  let bookListHtml = "";

  bookList.forEach((book, index) => {
    // console.log(book);
    bookListHtml += `
    <div class="col-lg-5 col-sm-10  ${index % 2 == 0 && "offset-2"} my-5 offset-lg-1 offset-md-2 offset-sm-2">
    <div class="row book__card">
      <div class="col-6">
        <img
          src="${book.imgSource}"
          alt=""
          class="img-fluid shadow"
          width="258px"
          height="400px"
        />
      </div>
      <div class="col-6 d-flex flex-column justify-content-center gap-2 book__list-card-info">
        <div class="book__detail">
          <span class="fos gray fs-5">${book.author}</span> <br />
          <span class="fs-4 fw-bold">${book.name}</span> <br />
          <span class="book__star-rate">
           ${createBookStars(book.starRate)}
            <span class="gray">${book.reviewCount} reviews</span>
          </span>
        </div>
        <p class="book__description fos gray">
         ${book.description}
        </p>
        <div>
          <span class="black fw-bold fs-4 me-2">${book.price}tl</span>
          <span class="fs-4 fw-bold old__price">${
            book.oldPrice
              ? `<span class="fs-4 fw-bold old__price">${book.oldPrice}tl</span>`
              : ""
          }</span>
        </div>
        <button class="btn__purple" onClick="addBookToBasket(${
          book.id
        })">Sepete Ekle</button>
      </div>
    </div>
  </div>
    `;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
  SELFIMPROVEMENT: "Kişisel Gelişim",
};
const createBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  // Filtre türlerini tutan dizi,"ALL" türüyle başlatılmıştır
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    // Filtre türleri dizisinde bu tür bulunmuyorsa ekleme işlemi yapar
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });
  // console.log(filterTypes);
  filterTypes.forEach((type, index) => {
    // console.log(type);
    filterHtml += ` <li onClick="filterBooks(this)" data-types="${type}" class="${
      index == 0 ? "active" : null
    }">${BOOK_TYPES[type] || type}</li>`;
  });

  filterEle.innerHTML = filterHtml;
};
const filterBooks = (filterEl) => {
  // console.log(filterEl);
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;
  console.log(bookType);
  getBooks();
  if (bookType != "ALL") {
    // console.log(bookType);
    bookList = bookList.filter((book) => book.type == bookType);
  }
  createBookItemsHtml();
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket__list");
  const basketCountEl = document.querySelector(".basket__count");
  console.log(basketList);
  const totalQuantity = basketList.reduce(
    (total, item) => total + item.quantity,
    0
  );
  basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
  const totalPriceEl = document.querySelector(".total__price");
  console.log(totalPriceEl);
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    console.log(item);
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `
    <li class="basket__item">
    <img
      src="${item.product.imgSource}"
      alt=""
      width="100"
      height="100"
    />
    <div class="basket__item-info">
      <h3 class="book__name">${item.product.name}</h3>
      <span class="book__price">${item.product.price}tl</span> <br />
      <span class="book__remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
    </div>
    <div class="book__count">
      <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="mx-2">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>
    
    `;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket__item">Sepette herhangi bir ürün bulunmuyor.Sepete ürün ekleyiniz.</li>`;
  totalPriceEl.innerHTML = totalPrice > 0 ? "Total: " + totalPrice.toFixed(2) + "tl" : null;
};
// Sepete ürün ekleme
const addBookToBasket = (bookId) => {
  // console.log(bookId);
  let findedBook = bookList.find((book) => book.id == bookId);
  // console.log(findedBook);
  if (findedBook) {
    // Sepetteki ürünün zaten var olup olmadığını kontrol etme
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    // Eğer sepet boş ise veya eklenen kitap sepette yoksa
    if (basketAlreadyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
    } else {
      // Sepette zaten var olan bir kitap ekleniyorsa, miktarını artırma
      basketList[basketAlreadyIndex].quantity += 1;
      // console.log(basketList);
    }
  }
  const btnCheck = document.querySelector(".btnCheck");
  // console.log(btnCheck);
  btnCheck.style.display = "block";
  // Sepet içeriğini güncelle ve görünteleme
  listBasketItems();
};
// Sepetten ürünü kaldırır
const removeItemBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  // Eğer kitap sepet içinde bulunuyorsa
  if (findedIndex != -1) {
    // Splice ı belirli sayıda eleman silmek için kullandık
    // sepet listesinden kitabı çıkar
    basketList.splice(findedIndex, 1);
  }
  const btnCheck = document.querySelector(".btnCheck");
  // console.log(btnCheck);
  btnCheck.style.display = "none";
  // Sepet içeriğini güncelleme
  listBasketItems();
};

// Sepetteki ürünün miktarını azaltma
const decreaseItemToBasket = (bookId) => {
  // console.log(bookId);
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  // Eğer kitap sepet içinde bulunuyorsa
  if (findedIndex != -1) {
    // Eğer kitabın miktarı 1'den büyükse
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    } else {
      removeItemBasket(bookId);
    }
    listBasketItems();
  }

  // Sepet içeriğini güncelleme
  listBasketItems();
};
// Sepetteki miktarı arttırma
const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);

  if (findedIndex >= 0) {
      const stockLimit = basketList[findedIndex].product.stock;

      if (stockLimit && basketList[findedIndex].quantity < stockLimit) {
          basketList[findedIndex].quantity += 1;
          listBasketItems();
      } else if (stockLimit && basketList[findedIndex].quantity === stockLimit) {
          // Stok limitine ulaşıldı, kullanıcıya bilgi verilebilir.
          alert(`Stok limitine ulaşıldı. Bu üründen en fazla ${stockLimit} adet ekleyebilirsiniz.`);
      } else {
          // Eğer stok sınırlaması yoksa veya limiti belirlenmemişse sınırsız eklenmesine izin ver.
          basketList[findedIndex].quantity += 1;
          listBasketItems();
      }
  }
}

// Datanın gelmesini bekledik
setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);