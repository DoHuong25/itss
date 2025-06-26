import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

// --- Styles ---
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '10px',
        width: '100%',
        boxSizing: 'border-box',
    },
    header: { fontSize: '24px', marginBottom: '20px' },
    formContainer: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '20px',
        backgroundColor: 'white',
        maxWidth: '100%',
        overflowX: 'auto'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0 20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
        maxWidth: '100%',
        overflowX: 'auto',
    },
    th: {
        borderBottom: '2px solid #ddd',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        textAlign: 'left'
    },
    td: { borderBottom: '1px solid #ddd', padding: '12px' },
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        boxSizing: 'border-box',
        minHeight: '80px'
    },
    button: {
        padding: '6px 12px',
        margin: '0 4px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        color: 'white'
    },
    submitButton: { backgroundColor: '#007bff' },
    editButton: { backgroundColor: '#ffc107' },
    deleteButton: { backgroundColor: '#dc3545' },
    cancelButton: { backgroundColor: '#6c757d' },
};

// --- Form initial state ---
const initialFormState = {
    title: '', price: '', quantity: '', category: 'Book', imageUrl: '', description: '',
    authors: '', coverType: '', publisher: '', publicationDate: '', numberOfPages: '', language: '',
    artist: '', recordLabel: '', tracklist: '', releaseDate: '',
    discType: '', director: '', runtime: '', studio: '', subtitles: '',
    genre: '',
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formState, setFormState] = useState(initialFormState);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            setError(null);
            const [booksRes, cdsRes, dvdsRes, lpsRes] = await Promise.all([
                apiClient.get('/books'),
                apiClient.get('/cds'),
                apiClient.get('/dvds'),
                apiClient.get('/lps')
            ]);

            const allProducts = [
                ...booksRes.data.map(p => ({ ...p, productType: 'Book' })),
                ...cdsRes.data.map(p => ({ ...p, productType: 'CD' })),
                ...dvdsRes.data.map(p => ({ ...p, productType: 'DVD' })),
                ...lpsRes.data.map(p => ({ ...p, productType: 'LP' }))
            ];

            allProducts.sort((a, b) => a.id - b.id);
            setProducts(allProducts);
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const resetForm = () => {
        setFormState(initialFormState);
        setEditingProduct(null);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormState({ ...initialFormState, ...product, category: product.productType });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEditing = editingProduct !== null;
        const method = isEditing ? 'put' : 'post';

        let endpoint = '';
        let formData = {
            title: formState.title,
            price: parseFloat(formState.price),
            quantity: parseInt(formState.quantity, 10),
            imageUrl: formState.imageUrl,
            description: formState.description,
            category: formState.category,
            genre: formState.genre,
        };

        switch (formState.category) {
            case 'Book':
                endpoint = `/books${isEditing ? `/${editingProduct.id}` : ''}`;
                formData = {
                    ...formData,
                    authors: formState.authors,
                    coverType: formState.coverType,
                    publisher: formState.publisher,
                    publicationDate: formState.publicationDate,
                    numberOfPages: parseInt(formState.numberOfPages, 10) || 0,
                    language: formState.language
                };
                break;
            case 'CD':
                endpoint = `/cds${isEditing ? `/${editingProduct.id}` : ''}`;
                formData = {
                    ...formData,
                    artist: formState.artist,
                    recordLabel: formState.recordLabel,
                    tracklist: formState.tracklist,
                    releaseDate: formState.releaseDate
                };
                break;
            case 'DVD':
                endpoint = `/dvds${isEditing ? `/${editingProduct.id}` : ''}`;
                formData = {
                    ...formData,
                    discType: formState.discType,
                    director: formState.director,
                    runtime: parseInt(formState.runtime, 10) || 0,
                    studio: formState.studio,
                    subtitles: formState.subtitles,
                    releaseDate: formState.releaseDate,
                    language: formState.language
                };
                break;
            case 'LP':
                endpoint = `/lps${isEditing ? `/${editingProduct.id}` : ''}`;
                formData = {
                    ...formData,
                    artist: formState.artist,
                    recordLabel: formState.recordLabel,
                    tracklist: formState.tracklist,
                    releaseDate: formState.releaseDate
                };
                break;
            default:
                setError('Loại sản phẩm không hợp lệ.');
                setLoading(false);
                return;
        }

        const dataToSend = isEditing ? { ...editingProduct, ...formData } : formData;

        try {
            await apiClient[method](endpoint, dataToSend);
            resetForm();
            fetchProducts();
        } catch (err) {
            setError(isEditing ? 'Cập nhật sản phẩm thất bại.' : 'Thêm sản phẩm thất bại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await apiClient.delete(`/products/${productId}`);
                fetchProducts();
            } catch (err) {
                setError('Xóa sản phẩm thất bại.');
                console.error(err);
            }
        }
    };

    const renderSpecificFields = () => {
        switch (formState.category) {
            case 'Book':
                return (
                    <>
                        <label>Tác giả</label><input name="authors" type="text" value={formState.authors || ''} onChange={handleInputChange} required style={styles.input} />
                        <label>Loại bìa</label><input name="coverType" type="text" value={formState.coverType || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Thể loại</label><input name="genre" type="text" value={formState.genre || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Ngôn ngữ</label><input name="language" type="text" value={formState.language || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Số trang</label><input name="numberOfPages" type="number" value={formState.numberOfPages || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Ngày xuất bản</label><input name="publicationDate" type="date" value={formState.publicationDate || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Nhà xuất bản</label><input name="publisher" type="text" value={formState.publisher || ''} onChange={handleInputChange} style={styles.input} />
                    </>
                );
            case 'CD':
            case 'LP':
                return (
                    <>
                        <label>Nghệ sĩ</label><input name="artist" type="text" value={formState.artist || ''} onChange={handleInputChange} required style={styles.input} />
                        <label>Hãng đĩa</label><input name="recordLabel" type="text" value={formState.recordLabel || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Thể loại</label><input name="genre" type="text" value={formState.genre || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Ngày phát hành</label><input name="releaseDate" type="date" value={formState.releaseDate || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Danh sách bài hát</label><textarea name="tracklist" value={formState.tracklist || ''} onChange={handleInputChange} style={styles.textarea} />
                    </>
                );
            case 'DVD':
                return (
                    <>
                        <label>Loại đĩa</label><input name="discType" type="text" value={formState.discType || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Đạo diễn</label><input name="director" type="text" value={formState.director || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Thời lượng (phút)</label><input name="runtime" type="number" value={formState.runtime || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Hãng phim</label><input name="studio" type="text" value={formState.studio || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Phụ đề</label><input name="subtitles" type="text" value={formState.subtitles || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Ngày phát hành</label><input name="releaseDate" type="date" value={formState.releaseDate || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Ngôn ngữ</label><input name="language" type="text" value={formState.language || ''} onChange={handleInputChange} style={styles.input} />
                        <label>Thể loại</label><input name="genre" type="text" value={formState.genre || ''} onChange={handleInputChange} style={styles.input} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Quản lý sản phẩm</h1>

            <div style={styles.formContainer}>
                <h2>{editingProduct ? `Sửa sản phẩm: ${editingProduct.title}` : 'Thêm sản phẩm mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>
                        <div>
                            <label>Loại sản phẩm</label>
                            <select name="category" value={formState.category} onChange={handleInputChange} style={styles.input} disabled={!!editingProduct}>
                                <option value="Book">Sách (Book)</option>
                                <option value="CD">Đĩa CD</option>
                                <option value="DVD">Đĩa DVD</option>
                                <option value="LP">Đĩa than (LP)</option>
                            </select>

                            <label>Tiêu đề</label><input name="title" type="text" value={formState.title} onChange={handleInputChange} required style={styles.input} />
                            <label>Giá</label><input name="price" type="number" value={formState.price} onChange={handleInputChange} required style={styles.input} />
                            <label>Số lượng</label><input name="quantity" type="number" value={formState.quantity} onChange={handleInputChange} required style={styles.input} />
                            <label>URL Hình ảnh</label><input name="imageUrl" type="text" value={formState.imageUrl} onChange={handleInputChange} style={styles.input} />
                            <label>Mô tả</label><textarea name="description" value={formState.description} onChange={handleInputChange} style={styles.textarea} />
                        </div>
                        <div>{renderSpecificFields()}</div>
                    </div>

                    <button type="submit" disabled={loading} style={{ ...styles.button, ...styles.submitButton, marginTop: '10px' }}>
                        {loading ? 'Đang lưu...' : (editingProduct ? 'Cập nhật' : 'Thêm sản phẩm')}
                    </button>
                    {editingProduct && (
                        <button type="button" onClick={resetForm} style={{ ...styles.button, ...styles.cancelButton, marginLeft: '10px' }}>
                            Hủy
                        </button>
                    )}
                </form>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>Danh sách sản phẩm</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Tiêu đề</th>
                        <th style={styles.th}>Loại</th>
                        <th style={styles.th}>Giá</th>
                        <th style={styles.th}>Số lượng</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td style={styles.td}>{product.id}</td>
                            <td style={styles.td}>{product.title}</td>
                            <td style={styles.td}>{product.productType}</td>
                            <td style={styles.td}>{product.price}</td>
                            <td style={styles.td}>{product.quantity}</td>
                            <td style={styles.td}>
                                <button onClick={() => handleEditClick(product)} style={{ ...styles.button, ...styles.editButton }}>Sửa</button>
                                <button onClick={() => handleDelete(product.id)} style={{ ...styles.button, ...styles.deleteButton }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;
