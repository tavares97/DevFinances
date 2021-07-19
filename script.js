const Modal = {
	open() {
		//Abre Modal
		document.querySelector('.modal-overlay').classList.add('active');
	},

	close() {
		//Fecha Modal
		document.querySelector('.modal-overlay').classList.remove('active');
	},
};

const transactions = [
	{
		description: 'Luz',
		amount: -50000,
		date: '15/07/2021',
	},
	{
		description: 'Gas',
		amount: 3000,
		date: '21/07/2021',
	},
	{
		description: 'Vodafone',
		amount: -3730,
		date: '21/07/2021',
	},
	{
		description: 'teste',
		amount: 100025,
		date: '21/07/2021',
	},
];

const Transaction = {
	all: transactions,

	add(transaction) {
		Transaction.all.push(transaction);

		App.reload();
	},

	remove(idx) {
		Transaction.all.splice(idx, 1);

		App.reload();
	},

	incomes() {
		let income = 0;

		Transaction.all.forEach(({ amount }) => {
			if (amount > 0) income += amount;
		});

		return income;
	},

	expenses() {
		let expense = 0;

		Transaction.all.forEach(({ amount }) => {
			if (amount < 0) expense += amount;
		});

		return expense;
	},

	total() {
		return this.incomes() + this.expenses();
	},
};

const DOM = {
	transactionsContainer: document.querySelector('#transactions-table tbody'),

	addTransaction(transaction, index) {
		const tr = document.createElement('tr');
		tr.innerHTML = DOM.innerHTMLTransaction(transaction);

		DOM.transactionsContainer.appendChild(tr);
	},

	innerHTMLTransaction({ description, amount, date }) {
		const CSSClass = amount > 0 ? 'income' : 'expense';

		const currency = Utils.formatCurrency(amount);

		const html = `
			<td class="description">${description}</td>
			<td class="${CSSClass}">${currency}</td>
			<td class="date">${date}</td>
			<td><img src="assets/minus.svg" alt="Remover" /></td>
		`;

		return html;
	},

	updateBalance() {
		document.getElementById('income').innerHTML = Utils.formatCurrency(
			Transaction.incomes()
		);
		document.getElementById('expense').innerHTML = Utils.formatCurrency(
			Transaction.expenses()
		);
		document.getElementById('total').innerHTML = Utils.formatCurrency(
			Transaction.total()
		);
	},

	clearTransactions() {
		DOM.transactionsContainer.innerHTML = '';
	},
};

const Utils = {
	formatCurrency(value) {
		value = Number(value) / 100;

		value = value.toLocaleString('pt-PT', {
			style: 'currency',
			currency: 'EUR',
		});
		return value;
	},
};

const Form = {
	description: document.querySelector('input#description'),
	amount: document.querySelector('input#amount'),
	date: document.querySelector('input#date'),

	getValues() {
		return {
			description: Form.description.value,
			amount: Form.amount.value,
			date: Form.date.value,
		};
	},

	formValidation() {
		const { description, amount, date } = this.getValues();

		if (
			description.trim() === '' ||
			amount.trim() === '' ||
			date.trim() === ''
		) {
			throw new Error('Os campos não podem estar vazios');
		}
	},

	submit(e) {
		e.preventDefault();

		try {
			this.formValidation();
		} catch (error) {
			alert(error.message);
		}
	},
};

const App = {
	init() {
		Transaction.all.forEach(transaction => {
			DOM.addTransaction(transaction);
		});

		DOM.updateBalance();
	},

	reload() {
		DOM.clearTransactions();
		App.init();
	},
};

App.init();
