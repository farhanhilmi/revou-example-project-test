const itemsPerPage = 5; // Number of items per page
let currentPage = 1; // Current page
const maxButtons = 5;
let sortDirection = '';

// Fetch JSON data
fetch('products.json')
	.then(response => response.json())
	.then(data => {
		let sortedData = data.slice();
		const tableBody = document.getElementById('table-body');
		const pagination = document.getElementById('pagination');
		const tableSearchInput = document.getElementById('table-search-input');

		// function to search data by product name in the table
		function handleSearchData(event) {
			sortedData = data.slice();
			const value = event.target.value.trim();
			console.log("search value: ", value)
			const filteredData = sortedData.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));

			sortedData = filteredData;
			displayItems();
		}

		// Function to display items on the current page
		function displayItems() {
			const start = (currentPage - 1) * itemsPerPage;
			const end = start + itemsPerPage;
			const paginatedItems = sortedData.slice(start, end);

			tableBody.innerHTML = '';
			paginatedItems.forEach(item => {
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${item.id}</td>
					<td>${item.name}</td>
					<td>${item.price}</td>
					<td>${item.qty}</td>
				`;
				tableBody.appendChild(row);
			});
		}

		// Function to sort data by price
		function sortByPrice() {
			if (sortDirection == '') {
				return
			}

			sortedData.sort((a, b) => {
				if (sortDirection === 'asc') {
					return a.price - b.price;
				} else {
					return b.price - a.price;
				}
			});

			displayItems();
		}

		// Function to toggle sort direction and re-sort data
		function toggleSortDirection() {
			currentPage = 1;
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
			sortByPrice();
			displayPagination();
			updateSortIcon();
		}

		// Function to update the sorting icon based on the current sort direction
		function updateSortIcon() {
			const sortIcon = document.getElementById('sort-icon');
			sortIcon.innerHTML = sortDirection === 'asc' ? '&#x25B2;' : '&#x25BC;';
		}


		// Function to display pagination
		function displayPagination() {
			const totalPages = Math.ceil(sortedData.length / itemsPerPage);
			pagination.innerHTML = '';
			const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
			const endPage = Math.min(totalPages, startPage + maxButtons - 1);

			if (startPage > 1) {
				const prevButton = document.createElement('button');
				prevButton.textContent = 'Prev';
				prevButton.addEventListener('click', () => {
					currentPage = Math.max(1, currentPage - 1);
					displayItems();
					displayPagination();
				});
				pagination.appendChild(prevButton);
			}

			for (let i = startPage; i <= endPage; i++) {
				const button = document.createElement('button');
				button.textContent = i;
				button.addEventListener('click', () => {
					currentPage = i;
					displayItems();
					displayPagination();
				});
				if (i === currentPage) {
					button.classList.add('active');
				}
				pagination.appendChild(button);
			}

			if (endPage < totalPages) {
				const nextButton = document.createElement('button');
				nextButton.textContent = 'Next';
				nextButton.addEventListener('click', () => {
					currentPage = Math.min(totalPages, currentPage + 1);
					displayItems();
					displayPagination();
				});
				pagination.appendChild(nextButton);
			}
		}


		displayItems();
		displayPagination();
		sortByPrice();

		// Event listener for toggling sort direction when price header is clicked
		document.getElementById('sort-price').addEventListener('click', toggleSortDirection);
		tableSearchInput.addEventListener('input', handleSearchData)
	})
	.catch(error => console.error('Error fetching data:', error));
