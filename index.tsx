
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

declare const Html5Qrcode: any;

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // As requested, allows login with any credentials, including empty ones.
    onLogin();
  };

  return (
    <div className="login-container">
      <h1>Mini Shop POS</h1>
      <form onSubmit={handleSubmit} className="form" aria-labelledby="login-heading">
        <div className="form-group">
          <label htmlFor="username">User Name</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="User Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">User Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="User Password"
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

const AddItemModal = ({ onClose, onSave, itemToEdit = null }) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [inStock, setInStock] = useState('');
  const [imageName, setImageName] = useState('');
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setItemName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
      setCost(itemToEdit.cost.toString());
      setInStock(itemToEdit.inStock.toString());
      setImageName(itemToEdit.image || '');
      setBarcode(itemToEdit.barcode || '');
    }
  }, [itemToEdit]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName || !category || !price || !cost || !inStock) {
        alert('Please fill out all fields.');
        return;
    }
    
    // Barcode validation: if provided, it must be numeric and between 8-13 digits.
    if (barcode && (!/^\d+$/.test(barcode) || barcode.length < 8 || barcode.length > 13)) {
        alert('Barcode must be a numeric value between 8 and 13 digits.');
        return;
    }

    const itemData = {
      name: itemName,
      category,
      price: parseFloat(price) || 0,
      cost: parseFloat(cost) || 0,
      inStock: parseInt(inStock, 10) || 0,
      image: imageName,
      barcode: barcode,
    };

    if (itemToEdit) {
        onSave({ ...itemData, id: itemToEdit.id });
    } else {
        onSave(itemData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{itemToEdit ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="form" id="item-form">
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input id="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="barcode">Barcode</label>
            <input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              pattern="\d*"
              title="Barcode must be 8 to 13 digits if provided."
              minLength={8}
              maxLength={13}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Cost</label>
            <input id="cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="inStock">In Stock</label>
            <input id="inStock" type="number" value={inStock} onChange={(e) => setInStock(e.target.value)} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="imageUpload">Item Image</label>
            <div className="file-upload-wrapper">
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="file-input" aria-label="Item Image Upload" />
                <label htmlFor="imageUpload" className="file-upload-label">
                    <span>{imageName || 'Choose a file...'}</span>
                </label>
                {imageName && <button type="button" className="btn-remove-image" onClick={() => setImageName('')} aria-label="Remove image">&times;</button>}
            </div>
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="item-form" className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ onNavigate, onLogout }) => {
    return (
      <div className="page-container dashboard-page">
        <header className="dashboard-header">
          <h2>Mini Shop Pos</h2>
          <button className="btn-icon btn-logout" onClick={onLogout} aria-label="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </header>
        <div className="dashboard-content">
          <div className="nav-grid">
            <button className="nav-card" onClick={() => onNavigate('sales')}>
              <div className="nav-card-icon">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <div className="nav-card-label">Sales</div>
            </button>
            <button className="nav-card" onClick={() => onNavigate('itemList')}>
              <div className="nav-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z" />
                </svg>
              </div>
              <div className="nav-card-label">Item List</div>
            </button>
            <button className="nav-card" onClick={() => onNavigate('customers')}>
                <div className="nav-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div className="nav-card-label">Customers</div>
            </button>
            <button className="nav-card" onClick={() => onNavigate('salesReport')}>
              <div className="nav-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 10h-2v4h2v-4zm4 0h-2v4h2v-4zm4-4h-2v8h2V6zM2 20h20v-2H2v2zm2-14v10h16V6H4z"/>
                </svg>
              </div>
              <div className="nav-card-label">Sales Report</div>
            </button>
            <button className="nav-card" onClick={() => onNavigate('posDevices')}>
              <div className="nav-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2H4zm17 4H3c-1.1 0-2 .9-2 2v8h20v-8c0-1.1-.9-2-2-2zm-3 7H6v-5h12v5z"/>
                </svg>
              </div>
              <div className="nav-card-label">Pos Devices</div>
            </button>
            <button className="nav-card" onClick={() => onNavigate('settings')}>
              <div className="nav-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                </svg>
              </div>
              <div className="nav-card-label">Settings</div>
            </button>
          </div>
        </div>
      </div>
    );
};

const ItemListPage = ({ onBack, products, onProductsUpdate, stockThreshold, showHeader = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stockFilter, setStockFilter] = useState('All items');
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const numericStockThreshold = Number(stockThreshold) || 10;

  const itemsWithSelection = useMemo(() => products.map(p => ({
    ...p,
    selected: selectedItemIds.has(p.id)
  })), [products, selectedItemIds]);

  const allSelected = products.length > 0 && selectedItemIds.size === products.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(products.map(p => p.id)));
    }
  };
  
  const handleSelectItem = (id) => {
    setSelectedItemIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const getMargin = (price, cost) => {
    if (price <= 0) return '0.00%';
    const margin = ((price - cost) / price) * 100;
    return `${margin.toFixed(2)}%`;
  };

  const handleAddItem = (newItem) => {
    const itemToAdd = {
        ...newItem,
        id: products.length > 0 ? Math.max(...products.map(i => i.id)) + 1 : 1,
    };
    onProductsUpdate([...products, itemToAdd]);
    setIsModalOpen(false);
  };
  
  const handleEdit = () => {
    const [selectedId] = selectedItemIds;
    const itemToEdit = products.find(item => item.id === selectedId);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
    }
  };

  const handleUpdateItem = (updatedItemData) => {
    onProductsUpdate(products.map(item => 
      item.id === updatedItemData.id 
        ? { ...item, ...updatedItemData } 
        : item
    ));
    setSelectedItemIds(prev => {
      const newIds = new Set(prev);
      newIds.delete(updatedItemData.id);
      return newIds;
    });
    setEditingItem(null);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'ascending') {
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>;
    }
    return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>;
  };

  const filteredItems = useMemo(() => itemsWithSelection.filter(item => {
    if (stockFilter === 'Low Stock') {
      return item.inStock <= numericStockThreshold;
    }
    return true;
  }), [itemsWithSelection, stockFilter, numericStockThreshold]);

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
        sortableItems.sort((a, b) => {
            let aVal, bVal;
            if (sortConfig.key === 'margin') {
                aVal = a.price > 0 ? (a.price - a.cost) / a.price : 0;
                bVal = b.price > 0 ? (b.price - b.cost) / b.price : 0;
            } else {
                aVal = a[sortConfig.key];
                bVal = b[sortConfig.key];
            }
            
            let compare = 0;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                compare = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
            } else { // handles numbers
                if (aVal < bVal) compare = -1;
                if (aVal > bVal) compare = 1;
            }

            return sortConfig.direction === 'ascending' ? compare : -compare;
        });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const selectedItemsCount = selectedItemIds.size;

  return (
    <>
      {isModalOpen && <AddItemModal onClose={() => setIsModalOpen(false)} onSave={handleAddItem} />}
      {editingItem && <AddItemModal itemToEdit={editingItem} onClose={() => setEditingItem(null)} onSave={handleUpdateItem} />}
      <div className="page-container item-list-page" style={!showHeader ? { height: '100%' } : {}}>
        {showHeader && (
          <header className="page-header">
            <button className="menu-btn" onClick={onBack} aria-label="Go back">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <h2>Item list</h2>
          </header>
        )}

        <div className="page-content">
          <div className="action-bar">
            <button className="btn-add-item" onClick={() => setIsModalOpen(true)}>+ ADD ITEM</button>
            <button className="btn-edit-item" onClick={handleEdit} disabled={selectedItemsCount !== 1}>
              EDIT
            </button>
            <button className="btn-more" aria-label="More options">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="category-filter">Category</label>
              <select id="category-filter" name="category-filter">
                <option>All items</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="stock-alert-filter">Stock alert</label>
              <select 
                id="stock-alert-filter" 
                name="stock-alert-filter"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option>All items</option>
                <option>Low Stock</option>
              </select>
            </div>
          </div>
          
          <div className="item-table-container">
            <div className="item-table">
              <div className="item-table-header item-table-row">
                <input type="checkbox" checked={allSelected} onChange={handleSelectAll} aria-label="Select all items"/>
                <div className="sortable-header" onClick={() => requestSort('name')}>
                  Item name {getSortIndicator('name')}
                </div>
                <div>Image</div>
                <div className="sortable-header" onClick={() => requestSort('category')}>
                  Category {getSortIndicator('category')}
                </div>
                <div className="sortable-header text-right" onClick={() => requestSort('price')}>
                  Price {getSortIndicator('price')}
                </div>
                <div className="sortable-header text-right" onClick={() => requestSort('cost')}>
                  Cost {getSortIndicator('cost')}
                </div>
                <div className="sortable-header text-right" onClick={() => requestSort('margin')}>
                  Margin {getSortIndicator('margin')}
                </div>
                <div className="sortable-header text-right" onClick={() => requestSort('inStock')}>
                  In stock {getSortIndicator('inStock')}
                </div>
              </div>

              {sortedItems.map(item => (
                <div key={item.id} className={`item-table-row ${item.inStock <= numericStockThreshold ? 'low-stock' : ''}`}>
                  <input type="checkbox" checked={item.selected} onChange={() => handleSelectItem(item.id)} aria-label={`Select ${item.name}`}/>
                  <div>{item.name}</div>
                  <div>{item.image || 'N/A'}</div>
                  <div>{item.category}</div>
                  <div className="text-right">{item.price.toLocaleString()}</div>
                  <div className="text-right">{item.cost.toLocaleString()}</div>
                  <div className="text-right">{getMargin(item.price, item.cost)}</div>
                  <div className="text-right stock-cell">
                    {item.inStock <= numericStockThreshold && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="Low stock warning">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                        </svg>
                    )}
                    {item.inStock}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pagination">
            <div className="pagination-rows">
              <label htmlFor="rows-per-page">Rows per page:</label>
              <select id="rows-per-page" name="rows-per-page">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <div className="pagination-info">
              Page: <input type="number" defaultValue="1" min="1" max="1" aria-label="Current page" /> of 1
            </div>
            <div className="pagination-nav">
              <button aria-label="Previous page" disabled>&lt;</button>
              <button aria-label="Next page" disabled>&gt;</button>
            </div>
          </div>
      </div>
    </>
  );
};

const PosUserModal = ({ onClose, onSave, userToEdit = null }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.name);
      setPassword(''); // Clear password field for edit mode
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      alert('Please fill out the User Name field.');
      return;
    }
    if (!userToEdit && !password) {
      alert('Please fill out the Password field for a new user.');
      return;
    }
    onSave({ id: userToEdit?.id, name: username });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{userToEdit ? 'Edit POS User' : 'Add POS User'}</h2>
        <form onSubmit={handleSubmit} className="form" id="pos-user-form">
          <div className="form-group">
            <label htmlFor="posUsername">User Name</label>
            <input id="posUsername" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="posPassword">{userToEdit ? 'New Password' : 'Password'}</label>
            <input
              id="posPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!userToEdit}
              placeholder={userToEdit ? 'Leave blank to keep current password' : ''}
              aria-label={userToEdit ? 'New Password' : 'Password'}
            />
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="pos-user-form" className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};

const PosDevicesPage = ({ onBack }) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Cashier 1', status: 'Active', selected: false },
    { id: 2, name: 'Manager', status: 'Active', selected: false },
    { id: 3, name: 'Support', status: 'Inactive', selected: false },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const handleAddUser = (newUser) => {
    const userToAdd = {
      ...newUser,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      status: 'Active',
      selected: false,
    };
    setUsers(prevUsers => [...prevUsers, userToAdd]);
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? { ...user, name: updatedUser.name } : user
    ));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };
  
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setUsers(users.map(user => ({ ...user, selected: isChecked })));
  };

  const handleSelectUser = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, selected: !user.selected } : user));
  };
  
  const handleBulkAction = (action) => {
      const newStatus = action === 'activate' ? 'Active' : 'Inactive';
      setUsers(users.map(user => user.selected ? { ...user, status: newStatus, selected: false } : user));
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const selectedUsersCount = users.filter(user => user.selected).length;
  const areAllSelected = users.length > 0 && selectedUsersCount === users.length;
  
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <>
      {isAddModalOpen && <PosUserModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddUser} />}
      {editingUser && <PosUserModal userToEdit={editingUser} onClose={() => setEditingUser(null)} onSave={handleUpdateUser} />}
      <div className="page-container pos-devices-page">
        <header className="page-header">
          <button className="menu-btn" onClick={onBack} aria-label="Go back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <h2>Pos Devices</h2>
        </header>
        <div className="page-content">
          <div className="action-bar">
            <button className="btn-add-item" onClick={() => setIsAddModalOpen(true)}>+ ADD POS USER</button>
            <button 
              className="btn-bulk-action btn-activate" 
              onClick={() => handleBulkAction('activate')} 
              disabled={selectedUsersCount === 0}
            >
              Activate
            </button>
            <button 
              className="btn-bulk-action btn-deactivate"
              onClick={() => handleBulkAction('deactivate')} 
              disabled={selectedUsersCount === 0}
            >
              Deactivate
            </button>
          </div>
          <div className="user-table-container">
            <div className="user-table">
              <div className="user-table-header user-table-row">
                <input type="checkbox" onChange={handleSelectAll} checked={areAllSelected} aria-label="Select all users" />
                <div onClick={() => requestSort('name')} className="sortable-header">
                  Name {getSortIndicator('name')}
                </div>
                <div onClick={() => requestSort('status')} className="sortable-header">
                  Status {getSortIndicator('status')}
                </div>
                <div className="text-right">Actions</div>
              </div>
              {sortedUsers.map(user => (
                <div key={user.id} className="user-table-row">
                  <input type="checkbox" onChange={() => handleSelectUser(user.id)} checked={user.selected} aria-label={`Select user ${user.name}`} />
                  <div>{user.name}</div>
                  <div>
                    <span className={`status-${user.status.toLowerCase()}`}>{user.status}</span>
                  </div>
                  <div className="user-actions">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => setEditingUser(user)}
                      aria-label={`Edit user ${user.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDeleteUser(user.id)}
                      aria-label={`Delete user ${user.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SettingsPage = ({ onBack, settings, onUpdate, showHeader = true }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate(localSettings);
    alert('Settings saved!');
  };

  const handleReset = () => {
    const defaultSettings = { currencySymbol: '$', stockThreshold: '10' };
    setLocalSettings(defaultSettings);
    onUpdate(defaultSettings);
    alert('Settings have been reset to default and saved.');
  };

  return (
    <div className="page-container settings-page" style={!showHeader ? { height: '100%' } : {}}>
      {showHeader && (
        <header className="page-header">
          <button className="menu-btn" onClick={onBack} aria-label="Go back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <h2>Settings</h2>
        </header>
      )}
      <div className="page-content">
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="currency-symbol">Currency Symbol</label>
            <input
              id="currency-symbol"
              type="text"
              value={localSettings.currencySymbol}
              onChange={(e) => handleChange('currencySymbol', e.target.value)}
              placeholder="e.g., $, €"
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock-threshold">Default Stock Alert Threshold</label>
            <input
              id="stock-threshold"
              type="number"
              value={localSettings.stockThreshold}
              onChange={(e) => handleChange('stockThreshold', e.target.value)}
              min="0"
            />
            <p className="form-hint">Items with stock at or below this level will be marked as 'Low Stock'.</p>
          </div>
        </div>
      </div>
      <div className="settings-actions">
          <button type="button" className="btn btn-reset" onClick={handleReset}>Reset to Default</button>
          <button type="button" className="btn btn-secondary" onClick={onBack}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

const PaymentModal = ({ total, customer, onClose, onConfirm }) => {
  const [cashReceived, setCashReceived] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('cash');

  useEffect(() => {
    if (selectedMethod === 'cash') {
        const input = document.getElementById('cashReceived');
        if (input) input.focus();
    }
  }, [selectedMethod]);

  const cashValue = parseFloat(cashReceived) || 0;
  const changeDue = selectedMethod === 'cash' ? cashValue - total : 0;
  const isConfirmDisabled = selectedMethod === 'cash' && cashValue < total;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (isConfirmDisabled) {
      return;
    }
    if (selectedMethod === 'cash') {
        onConfirm({ method: 'cash', changeDue });
    } else {
        onConfirm({ method: selectedMethod });
    }
  };
  
  const handleCreditPayment = () => {
    if (customer) {
        onConfirm({ method: 'credit' });
    }
  };

  // FIX: Added type for the amount parameter to resolve TypeScript errors.
  const handleQuickCash = (amount: string | number) => {
    setCashReceived(amount === 'exact' ? total.toString() : amount.toString());
  };

  // FIX: Added type for the num parameter to ensure type safety.
  const getNextRoundUp = (num: number) => {
    if (num <= 0) return 1000;
    const len = Math.floor(Math.log10(num));
    const powerOf10 = 10 ** len;
    return Math.ceil(num / powerOf10) * powerOf10;
  };
  
  // FIX: Added an explicit return type to useMemo to help TypeScript correctly infer the type of quickCashOptions.
  const quickCashOptions = useMemo<(string | number)[]>(() => {
    const exact = 'exact';
    const nextRound = getNextRoundUp(total);
    const options: (string | number)[] = [exact];
    
    if (total > 0) {
        if (nextRound > total) {
            options.push(nextRound);
        } else {
            const len = Math.floor(Math.log10(total));
            const powerOf10 = 10 ** len;
            options.push(nextRound + powerOf10);
        }
    }
    
    const lastOption = options[options.length - 1];
    if (typeof lastOption === 'number') {
        const len = Math.floor(Math.log10(lastOption));
        const powerOf10 = 10 ** len;
        options.push(lastOption + powerOf10);
    }
    
    return [...new Set(options)];
  }, [total]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Payment</h2>
        {customer && <p className="payment-customer-info">Customer: <strong>{customer.name}</strong></p>}
        <div className="payment-summary">
          <div className="payment-line">
            <span>Total Amount Due</span>
            <span className="payment-total">{total.toLocaleString()} MMK</span>
          </div>
        </div>

        <div className="payment-methods">
          <button type="button" className={`btn-payment-method ${selectedMethod === 'cash' ? 'active' : ''}`} onClick={() => setSelectedMethod('cash')}>Cash</button>
          <button type="button" className={`btn-payment-method ${selectedMethod === 'credit-card' ? 'active' : ''}`} onClick={() => setSelectedMethod('credit-card')}>Credit Card</button>
        </div>

        <form className="form" onSubmit={handleConfirm} id="payment-form">
            {selectedMethod === 'cash' ? (
            <>
              <div className="form-group">
                <label htmlFor="cashReceived">Cash Received</label>
                <input
                  id="cashReceived"
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  required
                  min={total}
                  placeholder="Enter amount received..."
                  className="cash-input"
                />
              </div>
              <div className="quick-cash-buttons">
                {quickCashOptions.map((amount) => (
                  <button type="button" key={amount.toString()} onClick={() => handleQuickCash(amount)} className="btn-quick-cash">
                    {amount === 'exact' ? 'Exact' : amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="payment-method-placeholder">
                <p>Process payment via external terminal.</p>
                <p><strong>Total: {total.toLocaleString()} MMK</strong></p>
            </div>
          )}
        </form>

        {selectedMethod === 'cash' && (
            <div className="payment-summary">
            <div className={`payment-line change-due ${changeDue < 0 ? 'negative' : ''}`}>
                <span>Change Due</span>
                <span className="payment-change">{changeDue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MMK</span>
            </div>
            </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {customer && <button type="button" className="btn btn-warning" onClick={handleCreditPayment}>On Credit</button>}
          <button type="submit" form="payment-form" className="btn btn-primary" disabled={isConfirmDisabled}>Confirm Sale</button>
        </div>
      </div>
    </div>
  );
};

const BarcodeScannerModal = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    const scanner = new Html5Qrcode("barcode-scanner-container");
    let isScanning = true;

    const successCallback = (decodedText, decodedResult) => {
      if (isScanning) {
        isScanning = false;
        scanner.stop().then(() => {
            onScanSuccess(decodedText);
        }).catch(err => {
            console.error("Failed to stop scanner", err);
            onScanSuccess(decodedText); // Still call onScanSuccess even if stop fails
        });
      }
    };

    const errorCallback = (errorMessage) => {
      // This callback can be ignored or used for debugging purposes.
    };
    
    Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length) {
            scanner.start(
              { facingMode: "environment" }, // Use the rear camera
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
              },
              successCallback,
              errorCallback
            ).catch(err => {
              console.error(`Unable to start scanning, error: ${err}`);
              alert('Error starting scanner. Please ensure camera permissions are enabled.');
              onClose();
            });
        } else {
            alert('No cameras found on this device.');
            onClose();
        }
    }).catch(err => {
        alert('Could not get camera permissions. Please allow camera access in your browser settings.');
        console.error("Camera permission error", err);
        onClose();
    });

    return () => {
      // Ensure the scanner is stopped when the component unmounts
      scanner.stop().catch(err => {
        // Ignore errors, scanner might already be stopped.
      });
    };
  }, [onScanSuccess, onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content barcode-scanner-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Scan Item Barcode</h2>
        <div id="barcode-scanner-container-wrapper">
          <div id="barcode-scanner-container"></div>
          <div className="scanner-overlay">
            <div className="scanner-box"></div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectCustomerModal = ({ customers, onSelect, onAddNew, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(searchTerm))
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Select Customer</h2>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Search by name or phone..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="customer-selection-list">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="customer-selection-item" onClick={() => onSelect(customer)}>
                            <div className="customer-selection-name">{customer.name}</div>
                            <div className="customer-selection-phone">{customer.phone}</div>
                        </div>
                    ))}
                    {filteredCustomers.length === 0 && <p>No customers found.</p>}
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={onAddNew}>+ Add New Customer</button>
                </div>
            </div>
        </div>
    );
};


const SalesContent = ({ products, onProductsUpdate, customers, onCustomerUpdate, stockThreshold }) => {
  const [tickets, setTickets] = useState([{ id: 1, name: 'Ticket 1', items: [], customer: null }]);
  const [activeTicketId, setActiveTicketId] = useState(1);
  const [nextTicketId, setNextTicketId] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddQuery, setQuickAddQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isSelectCustomerModalOpen, setIsSelectCustomerModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const numericStockThreshold = Number(stockThreshold) || 10;

  useEffect(() => {
    // Sync cart items with the master product list to prevent stale data
    // e.g., if a price is updated in Item List, it reflects in the cart.
    setTickets(currentTickets => 
      currentTickets.map(ticket => ({
        ...ticket,
        items: ticket.items.map(cartItem => {
          const freshProductData = products.find(p => p.id === cartItem.id);
          // If the product still exists, update its details in the cart,
          // but preserve the quantity that the user has already set.
          return freshProductData 
            ? { ...cartItem, ...freshProductData, quantity: cartItem.quantity }
            : cartItem; // If product was deleted, keep the old cart item data for this ticket
        })
      }))
    );
  }, [products]);

  const activeTicket = useMemo(() => tickets.find(t => t.id === activeTicketId) || tickets[0], [tickets, activeTicketId]);
  const cart = activeTicket ? activeTicket.items : [];
  const activeCustomer = activeTicket?.customer;

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

  const filteredItems = useMemo(() => {
    return products.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.barcode && item.barcode.includes(searchQuery));
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  const handleAddItemToCart = (product) => {
    // Prevent adding items that are out of stock.
    if (product.inStock <= 0) {
        alert('This item is out of stock.');
        return;
    }

    setTickets(currentTickets => 
        currentTickets.map(ticket => {
            if (ticket.id === activeTicketId) {
                const existingItem = ticket.items.find(item => item.id === product.id);
                let newItems;
                if (existingItem) {
                    // Prevent adding more items than available in stock.
                    if (existingItem.quantity < product.inStock) {
                        newItems = ticket.items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                    } else {
                        alert('Cannot add more than available in stock.');
                        return ticket;
                    }
                } else {
                    newItems = [...ticket.items, { ...product, quantity: 1 }];
                }
                return { ...ticket, items: newItems };
            }
            return ticket;
        })
    );
  };
  
  const handleOpenChargeModal = () => {
    if (cart.length === 0) return;
    setIsPaymentModalOpen(true);
  };
  
    const handleConfirmSale = (paymentInfo) => {
        const currentCart = activeTicket.items;
        const currentTotal = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // When a sale is confirmed, deduct the sold quantities from the main product list.
        const newProducts = products.map(p => {
            const itemInCart = currentCart.find(cartItem => cartItem.id === p.id);
            if (itemInCart) {
                // Decrease the inStock count for the sold item.
                return { ...p, inStock: p.inStock - itemInCart.quantity };
            }
            return p;
        });

        const newSale = {
            id: new Date().getTime(),
            date: new Date().toISOString(),
            items: currentCart,
            total: currentTotal,
            paymentMethod: paymentInfo.method,
            changeDue: paymentInfo.method === 'cash' ? paymentInfo.changeDue : 0,
            customerId: activeCustomer?.id,
            customerName: activeCustomer?.name,
        };
        
        // Update sales history
        const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
        salesHistory.push(newSale);
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

        // Update customer balance if it's a credit sale
        if (paymentInfo.method === 'credit' && activeCustomer) {
            const updatedCustomer = {
                ...activeCustomer,
                balance: (activeCustomer.balance || 0) + currentTotal,
                transactions: [
                    ...(activeCustomer.transactions || []),
                    {
                        date: newSale.date,
                        type: 'sale',
                        amount: currentTotal,
                        saleId: newSale.id,
                    },
                ],
            };
            onCustomerUpdate(updatedCustomer);
        }

        // Update the products state with the new stock levels.
        onProductsUpdate(newProducts);
        setReceiptData(newSale); // Show receipt modal
        setIsPaymentModalOpen(false);
    };

  
  const handleCloseReceipt = () => {
    setReceiptData(null); // Close the receipt modal
    const ticketIdToClose = activeTicketId;
    const remainingTickets = tickets.filter(t => t.id !== ticketIdToClose);

    if (remainingTickets.length > 0) {
        setTickets(remainingTickets);
        setActiveTicketId(remainingTickets[0].id);
    } else {
        const newTicketId = nextTicketId;
        setTickets([{ id: newTicketId, name: `Ticket ${newTicketId}`, items: [], customer: null }]);
        setActiveTicketId(newTicketId);
        setNextTicketId(newTicketId + 1);
    }
  }

  const handleScanSuccess = (decodedText) => {
    const foundProduct = products.find(p => p.barcode === decodedText);
    if (foundProduct) {
        handleAddItemToCart(foundProduct);
    } else {
        setSearchQuery(decodedText);
        alert(`No product found with barcode: ${decodedText}. The barcode has been entered into the search bar.`);
    }
    setIsScannerOpen(false);
  };

  const handleAddNewTicket = () => {
    const newTicket = { id: nextTicketId, name: `Ticket ${nextTicketId}`, items: [], customer: null };
    setTickets([...tickets, newTicket]);
    setActiveTicketId(nextTicketId);
    setNextTicketId(prev => prev + 1);
  };

  const handleCloseTicket = (ticketIdToClose) => {
    if (tickets.length === 1) {
        setTickets(prev => prev.map(t => t.id === ticketIdToClose ? { ...t, items: [], customer: null } : t));
        return;
    }

    const newTickets = tickets.filter(t => t.id !== ticketIdToClose);
    setTickets(newTickets);

    if (activeTicketId === ticketIdToClose) {
        setActiveTicketId(newTickets[0].id);
    }
  };

  const handleUpdateCartItem = (itemId, newQuantity) => {
    setTickets(currentTickets => currentTickets.map(ticket => {
        if (ticket.id === activeTicketId) {
            const product = products.find(p => p.id === itemId);
            if (!product) return ticket;

            if (newQuantity <= 0) {
                const updatedItems = ticket.items.filter(item => item.id !== itemId);
                return { ...ticket, items: updatedItems };
            } else if (newQuantity > product.inStock) {
                alert(`Only ${product.inStock} available in stock.`);
                return ticket;
            } else {
                const updatedItems = ticket.items.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                );
                return { ...ticket, items: updatedItems };
            }
        }
        return ticket;
    }));
    setEditingCartItem(null);
  };

  const handleRemoveCartItem = (itemId) => {
    setTickets(currentTickets => currentTickets.map(ticket => {
        if (ticket.id === activeTicketId) {
            const updatedItems = ticket.items.filter(item => item.id !== itemId);
            return { ...ticket, items: updatedItems };
        }
        return ticket;
    }));
    setEditingCartItem(null);
  };
  
    const handleSelectCustomer = (customer) => {
        setTickets(currentTickets => currentTickets.map(ticket => 
            ticket.id === activeTicketId ? { ...ticket, customer } : ticket
        ));
        setIsSelectCustomerModalOpen(false);
    };

    const handleAddNewCustomer = (newCustomer) => {
        const customerWithDefaults = {
            balance: 0,
            transactions: [],
            ...newCustomer
        };
        onCustomerUpdate(customerWithDefaults);
        handleSelectCustomer(customerWithDefaults);
        setIsAddCustomerModalOpen(false);
    };

    const handleQuickAdd = (e) => {
        if (e.key === 'Enter' && quickAddQuery.trim() !== '') {
            e.preventDefault();
            const searchTerm = quickAddQuery.trim().toLowerCase();
            
            // Prioritize exact barcode match
            let foundProduct = products.find(p => p.barcode === searchTerm);
            
            // If no barcode match, search by name (case-insensitive)
            if (!foundProduct) {
                foundProduct = products.find(p => p.name.toLowerCase().includes(searchTerm));
            }

            if (foundProduct) {
                handleAddItemToCart(foundProduct);
                setQuickAddQuery(''); // Clear input after adding
            } else {
                alert(`Item "${quickAddQuery}" not found.`);
            }
        }
    };


  const { total } = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { total: subtotal };
  }, [cart]);

  const AddItemToSaleModal = () => (
    <div className="modal-overlay" onClick={() => setIsAddItemModalOpen(false)}>
      <div className="modal-content add-item-modal" onClick={(e) => e.stopPropagation()}>
         <div className="items-panel">
          <header className="items-panel-header">
              <div className="search-bar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/></svg>
                  <input 
                      type="text" 
                      placeholder="Search for items or scan barcode..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search for items"
                  />
              </div>
              <div className="category-filters">
                  {categories.map(category => (
                      <button 
                          key={category}
                          className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                          onClick={() => setActiveCategory(category)}
                      >
                          {category}
                      </button>
                  ))}
              </div>
          </header>
          <div className="items-grid">
              {filteredItems.map(item => (
                  <div 
                      key={item.id} 
                      className={`item-card ${item.inStock === 0 ? 'out-of-stock' : ''} ${item.inStock > 0 && item.inStock <= numericStockThreshold ? 'low-stock-warning' : ''}`}
                      onClick={() => handleAddItemToCart(item)}
                      role="button"
                      tabIndex={item.inStock > 0 ? 0 : -1}
                      aria-label={`Add ${item.name} to sale. Price: ${item.price.toLocaleString()}, Stock: ${item.inStock}`}
                  >
                      <div className="item-card-image">
                        {item.image ? <img src={item.image} alt={item.name} /> : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        )}
                      </div>
                      <div className="item-card-details">
                          <span className="item-card-name">{item.name}</span>
                          <span className="item-card-price">{item.price.toLocaleString()} Ks</span>
                      </div>
                      {item.inStock === 0 && <div className="stock-overlay">OUT OF STOCK</div>}
                  </div>
              ))}
              {filteredItems.length === 0 && <p className="no-items-found">No items found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
  
  const EditCartItemModal = ({ item, onClose, onUpdate, onRemove }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1) {
            const product = products.find(p => p.id === item.id);
            if(newQuantity > product.inStock) {
                alert(`Only ${product.inStock} available in stock.`);
                return;
            }
            setQuantity(newQuantity);
        }
    };
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-cart-item-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit: {item.name}</h2>
                <div className="form-group">
                    <label>Quantity</label>
                    <div className="edit-quantity-controls">
                        <button onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">-</button>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} min="1" max={item.inStock} aria-label="Item quantity" />
                        <button onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-danger" onClick={() => onRemove(item.id)}>Remove Item</button>
                    <div className="spacer"></div>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={() => onUpdate(item.id, quantity)}>Update</button>
                </div>
            </div>
        </div>
    );
  };


  return (
    <>
      {isPaymentModalOpen && (
        <PaymentModal 
            total={total}
            customer={activeCustomer}
            onClose={() => setIsPaymentModalOpen(false)}
            onConfirm={handleConfirmSale}
        />
      )}
      {isScannerOpen && (
        <BarcodeScannerModal 
            onScanSuccess={handleScanSuccess}
            onClose={() => setIsScannerOpen(false)}
        />
      )}
      {isAddItemModalOpen && <AddItemToSaleModal />}
      {editingCartItem && (
        <EditCartItemModal
            item={editingCartItem}
            onClose={() => setEditingCartItem(null)}
            onUpdate={handleUpdateCartItem}
            onRemove={handleRemoveCartItem}
        />
      )}
      {receiptData && (
        <ReceiptModal 
          sale={receiptData} 
          onClose={handleCloseReceipt} 
          forNewSale={true} 
        />
      )}
      {isSelectCustomerModalOpen && (
          <SelectCustomerModal 
              customers={customers}
              onSelect={handleSelectCustomer}
              onAddNew={() => {
                  setIsSelectCustomerModalOpen(false);
                  setIsAddCustomerModalOpen(true);
              }}
              onClose={() => setIsSelectCustomerModalOpen(false)}
          />
      )}
      {isAddCustomerModalOpen && (
          <AddCustomerModal 
              onClose={() => setIsAddCustomerModalOpen(false)}
              onSave={handleAddNewCustomer}
          />
      )}

      <div className="sales-content-container dark-theme">
        <div className="ticket-tabs-container">
            {tickets.map(ticket => (
                <div 
                    key={ticket.id} 
                    className={`ticket-tab ${ticket.id === activeTicketId ? 'active' : ''}`}
                    onClick={() => setActiveTicketId(ticket.id)}
                    role="tab"
                    aria-selected={ticket.id === activeTicketId}
                >
                    <span>{ticket.name}</span>
                    <button 
                        className="btn-close-ticket" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTicket(ticket.id);
                        }}
                        aria-label={`Close ${ticket.name}`}
                    >
                        &times;
                    </button>
                </div>
            ))}
            <button className="btn-add-ticket" onClick={handleAddNewTicket} aria-label="Add New Ticket">+</button>
        </div>

        <header className="ticket-header">
            <div className="ticket-header-title">
                <h1>{activeTicket?.name || 'Ticket'}</h1>
                 {activeCustomer && <div className="ticket-customer-tag">{activeCustomer.name}</div>}
                <div className="ticket-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 0 0-3-3a3 3 0 0 0-3 3c0 .35.07.69.18 1H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-8-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1M9.5 16.5A1.5 1.5 0 0 1 8 15A1.5 1.5 0 0 1 9.5 13.5A1.5 1.5 0 0 1 11 15a1.5 1.5 0 0 1-1.5 1.5m5 0A1.5 1.5 0 0 1 13 15a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-5-4A1.5 1.5 0 0 1 8 11a1.5 1.5 0 0 1 1.5-1.5A1.5 1.5 0 0 1 11 11A1.5 1.5 0 0 1 9.5 12.5m5 0A1.5 1.5 0 0 1 13 11a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 14.5 12.5Z"/></svg>
                    <span>{cart.length}</span>
                </div>
            </div>
            <div className="ticket-header-actions">
                <button className="ticket-header-btn" aria-label="Add Customer" onClick={() => setIsSelectCustomerModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </button>
            </div>
        </header>

        <div className="charge-button-wrapper">
            <button className="btn-charge-main" onClick={handleOpenChargeModal} disabled={cart.length === 0}>
                CHARGE
                <span>Ks {total.toLocaleString()}</span>
            </button>
        </div>

        <div className="ticket-toolbar">
            <div className="quick-add-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/></svg>
                <input
                    type="text"
                    className="quick-add-input"
                    placeholder="Enter item name/barcode and press Enter..."
                    value={quickAddQuery}
                    onChange={(e) => setQuickAddQuery(e.target.value)}
                    onKeyDown={handleQuickAdd}
                    aria-label="Quick add item by name or barcode"
                />
            </div>
            <div className="ticket-toolbar-actions">
                <button className="ticket-toolbar-btn" onClick={() => setIsScannerOpen(true)} aria-label="Scan Barcode">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5v14h2V5H3zm2 0h2v14H5V5zm3 0h1v14H8V5zm2 0h1v14h-1V5zm2 0h1v14h-1V5zm3 0h2v14h-2V5zm3 0h3v14h-3V5z"/></svg>
                </button>
            </div>
        </div>

        <div className="ticket-items-list">
            {cart.length === 0 && (
                <div className="empty-ticket-message">
                    <p>Add items to the ticket</p>
                </div>
            )}
            {cart.map(item => (
                <div key={item.id} className="ticket-item" role="button" tabIndex={0} onClick={() => setEditingCartItem(item)}>
                    <div className="item-image-circle">
                        {item.image ? <img src={item.image} alt={item.name} /> : <div className="img-placeholder" />}
                    </div>
                    <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        {item.quantity > 1 && <span className="item-quantity">{item.quantity} x @ {item.price.toLocaleString()}</span>}
                    </div>
                    <span className="item-price">Ks {(item.price * item.quantity).toLocaleString()}</span>
                </div>
            ))}
        </div>

        <button className="fab-add-item" onClick={() => setIsAddItemModalOpen(true)} aria-label="Add Item to Sale">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>

      </div>
    </>
  );
};

const SalesPage = ({ onBack, products, onProductsUpdate, customers, onCustomerUpdate, stockThreshold }) => {
  return (
    <div className="sales-page-container">
      <header className="page-header">
        <button className="menu-btn" onClick={onBack} aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h2>Sales Page</h2>
      </header>
      <div className="sales-content-wrapper">
        <SalesContent products={products} onProductsUpdate={onProductsUpdate} customers={customers} onCustomerUpdate={onCustomerUpdate} stockThreshold={stockThreshold} />
      </div>
    </div>
  );
};

const ReceiptModal = ({ sale, onClose, forNewSale = false }) => {
    const handlePrint = () => {
      window.print();
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content receipt-modal-content">
          <div id="printable-receipt">
            <div className="receipt-header">
              <h2>Miin Shop POS</h2>
              <p>Date: {new Date(sale.date).toLocaleString()}</p>
              <p>Receipt #: {sale.id}</p>
            </div>
             {sale.customerName && (
              <div className="receipt-customer-info">
                  <p><strong>Customer:</strong> {sale.customerName}</p>
              </div>
            )}
            <div className="receipt-items">
              <div className="receipt-item header">
                  <span className="receipt-item-name">Item</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Total</span>
              </div>
              {sale.items.map(item => (
                  <div key={item.id} className="receipt-item">
                      <span className="receipt-item-name">{item.name}</span>
                      <span>{item.quantity}</span>
                      <span>{item.price.toLocaleString()}</span>
                      <span>{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
              ))}
            </div>
            <div className="receipt-summary">
              <div className="receipt-summary-line">
                <span>Total</span>
                <span>{sale.total.toLocaleString()} MMK</span>
              </div>
               <div className="receipt-summary-line">
                  <span>Payment Method</span>
                  <span style={{textTransform: 'capitalize'}}>{sale.paymentMethod}</span>
              </div>
              {sale.paymentMethod === 'cash' && sale.changeDue !== undefined && sale.changeDue >= 0 && (
                  <div className="receipt-summary-line">
                      <span>Change Due</span>
                      <span>{sale.changeDue.toLocaleString()} MMK</span>
                  </div>
              )}
            </div>
            <div className="receipt-footer">
              <p>Thank you for your purchase!</p>
            </div>
          </div>
          <div className="modal-actions no-print">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {forNewSale ? 'New Sale' : 'Close'}
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  };

const SaleDetailsModal = ({ sale, onClose }) => {
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    if (!sale) return null;
  
    return (
      <>
        {isReceiptOpen && <ReceiptModal sale={sale} onClose={() => setIsReceiptOpen(false)} />}
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sale Details</h2>
            <div className="sale-details-summary">
                <p><strong>Receipt #:</strong> {sale.id}</p>
                <p><strong>Date:</strong> {new Date(sale.date).toLocaleString()}</p>
                <p><strong>Total:</strong> {sale.total.toLocaleString()} MMK</p>
                {sale.customerName && <p><strong>Customer:</strong> {sale.customerName}</p>}
                <p><strong>Payment Method:</strong> <span style={{textTransform: 'capitalize'}}>{sale.paymentMethod}</span></p>
            </div>
            <div className="item-table-container">
                <div className="item-table">
                <div className="item-table-header item-table-row sale-details-header">
                    <div>Item Name</div>
                    <div className="text-right">Quantity</div>
                    <div className="text-right">Price</div>
                    <div className="text-right">Subtotal</div>
                </div>
                {sale.items.map(item => (
                    <div key={item.id} className="item-table-row sale-details-row">
                    <div>{item.name}</div>
                    <div className="text-right">{item.quantity}</div>
                    <div className="text-right">{item.price.toLocaleString()}</div>
                    <div className="text-right">{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                ))}
                </div>
            </div>
            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => setIsReceiptOpen(true)}>Print Receipt</button>
            </div>
            </div>
        </div>
      </>
    );
};

const SalesReportPage = ({ onBack }) => {
    const [allSales, setAllSales] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
  
    useEffect(() => {
      const storedSales = JSON.parse(localStorage.getItem('salesHistory') || '[]').sort((a, b) => b.id - a.id);
      setAllSales(storedSales);
    }, []);

    const filteredSales = useMemo(() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
    
        return allSales.filter(sale => {
            const saleDate = new Date(sale.date);
            const isWithinDate = saleDate >= start && saleDate <= end;
            if (!isWithinDate) return false;

            if (searchTerm.trim() === '') return true;

            const lowerSearchTerm = searchTerm.toLowerCase();
            return (
                sale.id.toString().includes(lowerSearchTerm) ||
                (sale.customerName && sale.customerName.toLowerCase().includes(lowerSearchTerm)) ||
                (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(lowerSearchTerm))
            );
        });
    }, [allSales, startDate, endDate, searchTerm]);
  
    const summary = useMemo(() => {
        const total = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
        const transactions = filteredSales.length;
        const itemsSold = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        return { total, transactions, itemsSold };
    }, [filteredSales]);

    return (
        <>
            {selectedSale && <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}
            <div className="page-container sales-report-page">
                <header className="page-header">
                    <button className="menu-btn" onClick={onBack} aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </button>
                    <h2>Sales Report</h2>
                </header>
                <div className="page-content">
                    <div className="report-filters">
                        <div className="filter-group">
                            <label htmlFor="start-date">Start Date</label>
                            <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="end-date">End Date</label>
                            <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="filter-group filter-group-search">
                            <label htmlFor="search-sales">Search</label>
                            <input 
                                id="search-sales"
                                type="text"
                                placeholder="Receipt #, Customer, Method"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="summary-cards">
                        <div className="summary-card">
                            <h3>Total Sales</h3>
                            <p>{summary.total.toLocaleString()} MMK</p>
                        </div>
                        <div className="summary-card">
                            <h3>Transactions</h3>
                            <p>{summary.transactions}</p>
                        </div>
                        <div className="summary-card">
                            <h3>Items Sold</h3>
                            <p>{summary.itemsSold}</p>
                        </div>
                    </div>

                    <div className="sales-table-container">
                        <div className="sales-table">
                            <div className="sales-table-header sales-table-row">
                                <div>Date</div>
                                <div>Customer</div>
                                <div>Items</div>
                                <div className="text-right">Total</div>
                                <div className="text-center">Details</div>
                            </div>
                            {filteredSales.map(sale => (
                                <div key={sale.id} className="sales-table-row">
                                    <div>{new Date(sale.date).toLocaleString()}</div>
                                    <div>{sale.customerName || 'N/A'}</div>
                                    <div>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                                    <div className="text-right">{sale.total.toLocaleString()} MMK</div>
                                    <div className="text-center">
                                        <button className="btn-view-details" onClick={() => setSelectedSale(sale)}>View</button>
                                    </div>
                                </div>
                            ))}
                             {filteredSales.length === 0 && (
                                <div className="no-sales-message">
                                    <p>No sales found for the selected criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const CustomersPage = ({ onBack, customers, onCustomerUpdate }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null);

    const handleSaveCustomer = (customerData) => {
        onCustomerUpdate(customerData);
        setIsAddModalOpen(false);
        setEditingCustomer(null);
    };

    return (
        <>
            {isAddModalOpen && <AddCustomerModal onClose={() => setIsAddModalOpen(false)} onSave={handleSaveCustomer} />}
            {editingCustomer && <AddCustomerModal customerToEdit={editingCustomer} onClose={() => setEditingCustomer(null)} onSave={handleSaveCustomer} />}
            {viewingCustomer && <CustomerDetailsModal customer={viewingCustomer} onClose={() => setViewingCustomer(null)} onCustomerUpdate={onCustomerUpdate} />}
            <div className="page-container customers-page">
                <header className="page-header">
                    <button className="menu-btn" onClick={onBack} aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </button>
                    <h2>Customers</h2>
                </header>
                <div className="page-content">
                    <div className="action-bar">
                        <button className="btn-add-item" onClick={() => setIsAddModalOpen(true)}>+ ADD CUSTOMER</button>
                    </div>
                    <div className="user-table-container">
                        <div className="user-table customer-table">
                            <div className="user-table-header user-table-row">
                                <div>Name</div>
                                <div>Phone</div>
                                <div className="text-right">Credit Balance</div>
                                <div className="text-center">Actions</div>
                            </div>
                            {customers.map(customer => (
                                <div key={customer.id} className="user-table-row" onClick={() => setViewingCustomer(customer)} style={{cursor: 'pointer'}}>
                                    <div>{customer.name}</div>
                                    <div>{customer.phone || 'N/A'}</div>
                                    <div className={`text-right ${customer.balance > 0 ? 'text-danger' : ''}`}>{customer.balance.toLocaleString()} MMK</div>
                                    <div className="user-actions text-center">
                                        <button 
                                            className="btn-icon btn-edit" 
                                            onClick={(e) => { e.stopPropagation(); setEditingCustomer(customer); }}
                                            aria-label={`Edit customer ${customer.name}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const AddCustomerModal = ({ onClose, onSave, customerToEdit = null }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (customerToEdit) {
            setName(customerToEdit.name);
            setPhone(customerToEdit.phone || '');
            setAddress(customerToEdit.address || '');
        }
    }, [customerToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            alert('Please enter a customer name.');
            return;
        }
        onSave({ id: customerToEdit?.id, name, phone, address });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
                <form onSubmit={handleSubmit} className="form" id="customer-form">
                    <div className="form-group">
                        <label htmlFor="customerName">Name</label>
                        <input id="customerName" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerPhone">Phone Number</label>
                        <input id="customerPhone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerAddress">Address</label>
                        <input id="customerAddress" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </form>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" form="customer-form" className="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    );
};

const CustomerDetailsModal = ({ customer, onClose, onCustomerUpdate }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleReceivePayment = (amount) => {
        const updatedCustomer = {
            ...customer,
            balance: customer.balance - amount,
            transactions: [
                ...(customer.transactions || []),
                {
                    date: new Date().toISOString(),
                    type: 'payment',
                    amount: -amount,
                },
            ],
        };
        onCustomerUpdate(updatedCustomer);
        setIsPaymentModalOpen(false);
    };

    const ReceivePaymentModal = () => {
        const [amount, setAmount] = useState('');
        const handleSubmit = (e) => {
            e.preventDefault();
            const paymentAmount = parseFloat(amount);
            if (paymentAmount > 0) {
                handleReceivePayment(paymentAmount);
            }
        };
        return (
            <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Receive Payment</h2>
                    <p>Current Balance: {customer.balance.toLocaleString()} MMK</p>
                    <form id="payment-receive-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="paymentAmount">Payment Amount</label>
                            <input id="paymentAmount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" max={customer.balance} autoFocus/>
                        </div>
                    </form>
                     <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</button>
                        <button type="submit" form="payment-receive-form" className="btn btn-primary">Receive</button>
                    </div>
                </div>
            </div>
        )
    };
    
    const sortedTransactions = (customer.transactions || []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            {isPaymentModalOpen && <ReceivePaymentModal />}
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content customer-details-modal" onClick={(e) => e.stopPropagation()}>
                    <h2>{customer.name}</h2>
                    <div className="customer-details-summary">
                        <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
                        <p><strong>Credit Balance:</strong> <span className={`balance ${customer.balance > 0 ? 'text-danger' : 'text-success'}`}>{customer.balance.toLocaleString()} MMK</span></p>
                    </div>
                    <h4>Transaction History</h4>
                    <div className="transaction-history-container">
                        {sortedTransactions.length === 0 ? <p>No transactions found.</p> : (
                            <div className="transaction-table">
                                <div className="transaction-table-row header">
                                    <div>Date</div>
                                    <div>Type</div>
                                    <div className="text-right">Amount</div>
                                </div>
                                {sortedTransactions.map(tx => (
                                    <div key={tx.date} className="transaction-table-row">
                                        <div>{new Date(tx.date).toLocaleDateString()}</div>
                                        <div>{tx.type}</div>
                                        <div className={`text-right ${tx.type === 'sale' ? 'text-danger' : 'text-success'}`}>{tx.amount.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => setIsPaymentModalOpen(true)} disabled={customer.balance <= 0}>Receive Payment</button>
                    </div>
                </div>
            </div>
        </>
    );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'dashboard', 'itemList', 'posDevices', 'settings', 'sales', 'salesReport', 'customers'
  
  const initialProducts = [
    { id: 1, name: 'Solar ရွှေမု', category: 'Electronics', price: 15000, cost: 10000, inStock: 15, image: 'solar-panel.jpg', barcode: '899000100101' },
    { id: 2, name: 'Usb tipe C', category: 'Accessories', price: 1500, cost: 3000, inStock: 32, image: 'usb-c-cable.png', barcode: '899000100102' },
    { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 12000, cost: 8000, inStock: 8, image: '', barcode: '899000100103' },
    { id: 4, name: 'Wireless Mouse', category: 'Peripherals', price: 18000, cost: 12000, inStock: 11, image: 'wireless-mouse.jpg', barcode: '899000100104' },
    { id: 5, name: 'Phone Charger', category: 'Electronics', price: 9000, cost: 6000, inStock: 5, image: '', barcode: '899000100105' },
    { id: 6, name: 'Bluetooth Speaker', category: 'Electronics', price: 25000, cost: 18000, inStock: 20, image: '', barcode: '899000100106' },
    { id: 7, name: 'Screen Protector', category: 'Accessories', price: 3000, cost: 1000, inStock: 50, image: '', barcode: '899000100107' },
    { id: 8, name: 'Keyboard', category: 'Peripherals', price: 22000, cost: 15000, inStock: 7, image: '', barcode: '899000100108' },
  ];
  
  const [products, setProducts] = useState(initialProducts);

  const [customers, setCustomers] = useState(() => {
    try {
        const saved = localStorage.getItem('customers');
        const initialValue = saved ? JSON.parse(saved) : [
            { id: 1, name: 'Walking Customer', phone: 'N/A', address: 'N/A', balance: 0, transactions: [] },
            { id: 2, name: 'Ko Ko', phone: '09123456789', address: 'Yangon', balance: 7500, transactions: [
                { date: new Date(Date.now() - 86400000).toISOString(), type: 'sale', amount: 7500, saleId: 12345 }
            ] },
        ];
        return initialValue;
    } catch (e) {
        return [];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('settings');
      return saved ? JSON.parse(saved) : { currencySymbol: 'MMK', stockThreshold: '10' };
    } catch (e) {
      return { currencySymbol: 'MMK', stockThreshold: '10' };
    }
  });

  useEffect(() => {
      localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);
  
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const handleProductsUpdate = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  const handleCustomerUpdate = (updatedCustomer) => {
      const existing = customers.find(c => c.id === updatedCustomer.id);
      if (existing) {
          setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      } else {
          const newCustomer = { ...updatedCustomer, id: Date.now() };
          setCustomers([...customers, newCustomer]);
      }
  };

  const handleSettingsUpdate = (newSettings) => {
    setSettings(newSettings);
  };

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };
  
  let pageContent;
  switch (currentPage) {
    case 'dashboard':
      pageContent = <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />;
      break;
    case 'itemList':
      pageContent = <ItemListPage onBack={() => handleNavigate('dashboard')} products={products} onProductsUpdate={handleProductsUpdate} stockThreshold={settings.stockThreshold} />;
      break;
    case 'posDevices':
      pageContent = <PosDevicesPage onBack={() => handleNavigate('dashboard')} />;
      break;
    case 'settings':
      pageContent = <SettingsPage onBack={() => handleNavigate('dashboard')} settings={settings} onUpdate={handleSettingsUpdate} />;
      break;
    case 'sales':
      pageContent = <SalesPage onBack={() => handleNavigate('dashboard')} products={products} onProductsUpdate={handleProductsUpdate} customers={customers} onCustomerUpdate={handleCustomerUpdate} stockThreshold={settings.stockThreshold} />;
      break;
    case 'salesReport':
      pageContent = <SalesReportPage onBack={() => handleNavigate('dashboard')} />;
      break;
    case 'customers':
      pageContent = <CustomersPage onBack={() => handleNavigate('dashboard')} customers={customers} onCustomerUpdate={handleCustomerUpdate} />;
      break;
    case 'login':
    default:
      pageContent = <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main>
      {pageContent}
    </main>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
