app.controller('contactdetailsCtrl', ['ContactService', 'AddressBookService', 'vCardPropertiesService', '$routeParams', '$scope', function(ContactService, AddressBookService, vCardPropertiesService, $routeParams, $scope) {
	var ctrl = this;

	ctrl.uid = $routeParams.uid;
	ctrl.t = {
		noContacts : t('contacts', 'No contacts in here'),
		placeholderName : t('contacts', 'Name')
	};

	ctrl.fieldDefinitions = vCardPropertiesService.fieldDefinitions;
	$scope.addressBooks = [];

	AddressBookService.getAll().then(function(addressBooks) {
		//$scope.addressBooks = addressBooks.map(function (element) {
		//	return {
		//		id: element.displayName,
		//		name: element.displayName
		//	};
		//});
		$scope.addressBooks = addressBooks;
	});

	$scope.$watch('ctrl.uid', function(newValue, oldValue) {
		ctrl.changeContact(newValue);
	});

	ctrl.changeContact = function(uid) {
		if (typeof uid === "undefined") {
			return;
		}
		ContactService.getById(uid).then(function(contact) {
			ctrl.contact = contact;
			ctrl.singleProperties = ctrl.contact.getSingleProperties();
			ctrl.photo = ctrl.contact.photo();
			$scope.addressBook = ctrl.contact.addressBook;
		});
	};

	ctrl.updateContact = function() {
		ContactService.update(ctrl.contact);
		console.log('updating Contact');
	};

	ctrl.deleteContact = function() {
		ContactService.delete(ctrl.contact);
		console.log('Deleting Contact');
	};

	ctrl.addField = function(field) {
		ctrl.contact.setProperty(field, {value: ''});
		ctrl.singleProperties = ctrl.contact.getSingleProperties();
	};

	ctrl.changeAddressBook = function (addressBook) {
		ContactService.moveContact(ctrl.contact, addressBook);
	};
}]);
