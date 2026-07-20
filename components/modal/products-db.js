// -------------------------------------------------------------
// CLOUD DATABASE & LOCAL STORAGE FALLBACK ADAPTER
// -------------------------------------------------------------

(function() {
    let supabase = null;
    let useCloudDB = false;

    // Check if Supabase configuration credentials are provided
    if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined' && SUPABASE_URL && SUPABASE_KEY) {
        try {
            // Initialize Supabase Client
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            useCloudDB = true;
            console.log('[Database] Connected to Supabase Cloud PostgreSQL database.');
        } catch (err) {
            console.error('[Database] Failed to initialize Supabase client:', err);
        }
    } else {
        console.log('[Database] Supabase credentials not detected. Falling back to browser LocalStorage.');
    }

    const defaultCatalog = [
        {
            id: "p1",
            name: "Brass Diya Set",
            size: 'Height: 8 inches, Width: 4 inches',
            price: '₹2,450 / $30',
            quantity: 'In stock (15 sets available)',
            desc: 'Handcrafted traditional brass oil lamps with five wicks, finished with antique brass polish.',
            material: 'brass',
            img: 'image/pexels-eiakash-37013404.jpg',
            images: [
                'image/pexels-eiakash-37013404.jpg',
                'image/pexels-love-hater-373675099-20083403.jpg',
                'image/pexels-stijn-dijkstra-1306815-15534236.jpg',
                'image/pexels-subrata-deb-1282362-32842479.jpg',
                'image/pexels-shuttersangam-33625236.jpg',
                'image/pexels-yatrikyash-34575545.jpg',
                'image/pexels-manishjangid-36470557.jpg',
                'image/pexels-yatrikyash-34575532.jpg',
                'image/pexels-eiakash-37013404.jpg',
                'image/pexels-subrata-deb-1282362-32842479.jpg'
            ]
        },
        {
            id: "p2",
            name: "Marble Jali Panel",
            size: '18 x 18 inches, Thickness: 1.5 inches',
            price: '₹5,800 / $70',
            quantity: 'Made to order (7 days lead time)',
            desc: 'Intricate marble lattice carving replicating Mughal architectural elements. Perfect for windows or partitions.',
            material: 'stone',
            img: 'image/pexels-love-hater-373675099-20083403.jpg',
            images: ['image/pexels-love-hater-373675099-20083403.jpg']
        },
        {
            id: "p3",
            name: "Iron Lantern",
            size: 'Height: 16 inches, Diameter: 7 inches',
            price: '₹1,950 / $24',
            quantity: 'In stock (8 pieces available)',
            desc: 'Classic hexagonal forged iron hanging lantern with textured yellow glass panels.',
            material: 'iron',
            img: 'image/pexels-stijn-dijkstra-1306815-15534236.jpg',
            images: ['image/pexels-stijn-dijkstra-1306815-15534236.jpg']
        },
        {
            id: "p4",
            name: "Etched Brass Tray",
            size: 'Diameter: 14 inches',
            price: '₹1,800 / $22',
            quantity: 'In stock (20 pieces available)',
            desc: 'Hand-hammered brass circular tray with intricate Mughal floral engravings.',
            material: 'brass',
            img: 'image/pexels-subrata-deb-1282362-32842479.jpg',
            images: ['image/pexels-subrata-deb-1282362-32842479.jpg']
        },
        {
            id: "p5",
            name: "Iron Wall Sconce",
            size: '12 x 6 x 4 inches',
            price: '₹1,500 / $18',
            quantity: 'In stock (10 pairs available)',
            desc: 'Industrial-meets-antique forged iron wall torch fitting. Holds glass jar candle or bulb.',
            material: 'iron',
            img: 'image/pexels-shuttersangam-33625236.jpg',
            images: ['image/pexels-shuttersangam-33625236.jpg']
        },
        {
            id: "p6",
            name: "Brass Urn",
            size: 'Height: 22 inches, Diameter: 12 inches',
            price: '₹8,500 / $102',
            quantity: 'In stock (3 pieces available)',
            desc: 'Large vintage-finished brass vessel with heavy handles and detailed lid work.',
            material: 'brass',
            img: 'image/pexels-yatrikyash-34575545.jpg',
            images: ['image/pexels-yatrikyash-34575545.jpg']
        },
        {
            id: "p7",
            name: "Sandstone Jharokha",
            size: '24 x 16 inches, Depth: 6 inches',
            price: '₹7,200 / $88',
            quantity: 'Made to order (10 days lead time)',
            desc: 'Jodhpur pink sandstone balcony arch model, hand-chiseled by generational artisans.',
            material: 'stone',
            img: 'image/pexels-manishjangid-36470557.jpg',
            images: ['image/pexels-manishjangid-36470557.jpg']
        },
        {
            id: "p8",
            name: "Forged Candle Stand",
            size: 'Height: 14 inches',
            price: '₹1,200 / $15',
            quantity: 'In stock (25 pieces available)',
            desc: 'Minimalist twisted wrought-iron candle pillar holder with anti-rust black coating.',
            material: 'iron',
            img: 'image/pexels-yatrikyash-34575532.jpg',
            images: ['image/pexels-yatrikyash-34575532.jpg']
        },
        {
            id: "p9",
            name: "Terracotta Diya Set",
            size: 'Width: 3.5 inches per piece',
            price: '₹350 / $4 (Pack of 6)',
            quantity: 'In stock (50 packs available)',
            desc: 'Traditional clay oil lamps, hand-painted in bright organic Rajasthan ochre and red dyes.',
            material: 'terracotta',
            img: 'image/pexels-eiakash-37013404.jpg',
            images: ['image/pexels-eiakash-37013404.jpg']
        },
        {
            id: "p10",
            name: "Vintage Enamel Sign",
            size: '12 x 18 inches',
            price: '₹2,100 / $26',
            quantity: 'In stock (5 signs available)',
            desc: 'Distressed vintage-style enamel street/advertisement sign board, hand-enameled on steel.',
            material: 'enamel',
            img: 'image/pexels-subrata-deb-1282362-32842479.jpg',
            images: ['image/pexels-subrata-deb-1282362-32842479.jpg']
        },
        {
            id: "p11",
            name: "Fine Porcelain Vase",
            size: 'Height: 10 inches',
            price: '₹3,200 / $39',
            quantity: 'In stock (6 pieces available)',
            desc: 'Glossy ceramic porcelain vase with hand-painted blue pottery floral motifs.',
            material: 'porcelain',
            img: 'image/pexels-love-hater-373675099-20083403.jpg',
            images: ['image/pexels-love-hater-373675099-20083403.jpg']
        },
        {
            id: "p12",
            name: "Terracotta Urn",
            size: 'Height: 18 inches, Diameter: 10 inches',
            price: '₹2,600 / $32',
            quantity: 'In stock (12 pieces available)',
            desc: 'Traditional clay water vessel shape, rustic unglazed terracotta finish with linear ridges.',
            material: 'terracotta',
            img: 'image/pexels-manishjangid-36470557.jpg',
            images: ['image/pexels-manishjangid-36470557.jpg']
        }
    ];

    // Seed/migrate default catalog local database if not present or needs schema changes
    let storedCatalog = null;
    let needsUpgrade = false;
    
    try {
        storedCatalog = localStorage.getItem('product_catalog');
        if (storedCatalog) {
            try {
                const parsed = JSON.parse(storedCatalog);
                if (parsed.length > 0 && !parsed[0].images) {
                    needsUpgrade = true;
                }
            } catch(err) {
                needsUpgrade = true;
            }
        }

        if (!storedCatalog || needsUpgrade) {
            localStorage.setItem('product_catalog', JSON.stringify(defaultCatalog));
        }
    } catch (err) {
        console.warn('[Database] LocalStorage read/write blocked by browser security rules:', err);
    }

    // Expose unified window database API
    window.ProductCatalog = {
        // --- 1. PRODUCT CATALOG METHODS ---
        getAll: async function() {
            if (useCloudDB && supabase) {
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*');
                    
                    if (error) throw error;
                    
                    if (data && data.length > 0) {
                        return data.map(item => {
                            // Map database columns back to schema
                            if (item.desc_text) {
                                item.desc = item.desc_text;
                            }
                            if (!item.images) {
                                item.images = item.img ? [item.img] : [];
                            }
                            return item;
                        });
                    }
                    
                    // Seed cloud DB with defaults if completely empty
                    console.log('[Database] Cloud database empty. Seeding defaults...');
                    await this.seedCloudCatalog(defaultCatalog);
                    return defaultCatalog;
                } catch (err) {
                    console.error('[Database] Supabase query failed, returning LocalStorage fallback:', err);
                }
            }

            // Local fallback
            const list = JSON.parse(localStorage.getItem('product_catalog') || '[]');
            return list.map(item => {
                if (!item.images) {
                    item.images = item.img ? [item.img] : [];
                }
                if (!item.img && item.images.length > 0) {
                    item.img = item.images[0];
                }
                return item;
            });
        },
        
        save: function(catalog) {
            // Helper for local storage
            localStorage.setItem('product_catalog', JSON.stringify(catalog));
        },
        
        add: async function(item) {
            item.id = 'p_' + Date.now();
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('products')
                        .insert([{
                            id: item.id,
                            name: item.name,
                            material: item.material,
                            size: item.size,
                            price: item.price,
                            quantity: item.quantity,
                            desc_text: item.desc,
                            img: item.img,
                            images: item.images
                        }]);
                    if (error) throw error;
                    return item;
                } catch (err) {
                    console.error('[Database] Supabase insert product failed:', err);
                }
            }

            // Local fallback
            const catalog = await this.getAll();
            catalog.push(item);
            this.save(catalog);
            return item;
        },
        
        delete: async function(id) {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('products')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase delete product failed:', err);
                }
            }

            // Local fallback
            let catalog = await this.getAll();
            catalog = catalog.filter(item => item.id !== id);
            this.save(catalog);
        },

        update: async function(id, updatedItem) {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('products')
                        .update({
                            name: updatedItem.name,
                            material: updatedItem.material,
                            size: updatedItem.size,
                            price: updatedItem.price,
                            quantity: updatedItem.quantity,
                            desc_text: updatedItem.desc,
                            img: updatedItem.img,
                            images: updatedItem.images
                        })
                        .eq('id', id);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase update product failed:', err);
                }
            }

            // Local fallback
            let catalog = await this.getAll();
            catalog = catalog.map(item => {
                if (item.id === id) {
                    // Retain ID, merge modifications
                    return { ...item, ...updatedItem, id: item.id };
                }
                return item;
            });
            this.save(catalog);
        },

        seedCloudCatalog: async function(list) {
            if (!supabase) return;
            try {
                const rows = list.map(item => ({
                    id: item.id,
                    name: item.name,
                    material: item.material,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity,
                    desc_text: item.desc,
                    img: item.img,
                    images: item.images
                }));
                
                const { error } = await supabase
                    .from('products')
                    .insert(rows);
                if (error) throw error;
                console.log('[Database] Seeded cloud catalogue.');
            } catch (err) {
                console.error('[Database] Cloud seeding failed:', err);
            }
        },

        // --- 2. ENQUIRIES LOGGING METHODS ---
        getEnquiries: async function() {
            if (useCloudDB && supabase) {
                try {
                    const { data, error } = await supabase
                        .from('enquiries')
                        .select('*')
                        .order('id', { ascending: false });
                    if (error) throw error;
                    return data || [];
                } catch (err) {
                    console.error('[Database] Supabase queries for enquiries failed:', err);
                }
            }
            // Local fallback
            return JSON.parse(localStorage.getItem('enquiry_requests') || '[]');
        },

        addEnquiry: async function(productName, clientContact, channel) {
            const newRequest = {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                product: productName,
                contact: clientContact,
                channel: channel, // 'WhatsApp' or 'Email'
                status: 'Pending'
            };

            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('enquiries')
                        .insert([newRequest]);
                    if (error) throw error;
                    return newRequest;
                } catch (err) {
                    console.error('[Database] Supabase insert enquiry failed:', err);
                }
            }

            // Local fallback
            let requests = JSON.parse(localStorage.getItem('enquiry_requests') || '[]');
            requests.unshift(newRequest);
            localStorage.setItem('enquiry_requests', JSON.stringify(requests));
            return newRequest;
        },

        updateEnquiryStatus: async function(id, status) {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('enquiries')
                        .update({ status: status })
                        .eq('id', id);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase update enquiry failed:', err);
                }
            }

            // Local fallback
            let enquiries = JSON.parse(localStorage.getItem('enquiry_requests') || '[]');
            enquiries = enquiries.map(r => {
                if (r.id === id) r.status = status;
                return r;
            });
            localStorage.setItem('enquiry_requests', JSON.stringify(enquiries));
        },

        deleteEnquiry: async function(id) {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('enquiries')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase delete enquiry failed:', err);
                }
            }

            // Local fallback
            let enquiries = JSON.parse(localStorage.getItem('enquiry_requests') || '[]');
            enquiries = enquiries.filter(r => r.id !== id);
            localStorage.setItem('enquiry_requests', JSON.stringify(enquiries));
        },

        clearAllEnquiries: async function() {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('enquiries')
                        .delete()
                        .neq('id', 0); // Deletes all rows where ID != 0
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase truncate enquiries failed:', err);
                }
            }

            // Local fallback
            localStorage.setItem('enquiry_requests', '[]');
        },

        getCategories: async function() {
            const defaultCats = [
                { id: "brass", name: "Brass", img: "image/pexels-eiakash-37013404.jpg" },
                { id: "stone", name: "Stone", img: "image/pexels-love-hater-373675099-20083403.jpg" },
                { id: "iron", name: "Iron", img: "image/pexels-stijn-dijkstra-1306815-15534236.jpg" },
                { id: "terracotta", name: "Terracotta", img: "image/pexels-shuttersangam-33625236.jpg" },
                { id: "porcelain", name: "Porcelain", img: "image/pexels-love-hater-373675099-20083403.jpg" },
                { id: "enamel", name: "Enamel", img: "image/pexels-subrata-deb-1282362-32842479.jpg" }
            ];

            if (useCloudDB && supabase) {
                try {
                    const { data, error } = await supabase
                        .from('categories')
                        .select('*')
                        .order('name', { ascending: true });
                    if (error) throw error;
                    
                    if (data && data.length > 0) {
                        return data;
                    }

                    // Seed cloud DB if table is empty
                    console.log('[Database] Cloud categories table is empty. Seeding default collections...');
                    await supabase.from('categories').insert(defaultCats);
                    return defaultCats;
                } catch (err) {
                    console.warn('[Database] Supabase categories query failed, using local fallback.', err);
                }
            }

            // Local fallback
            try {
                const local = localStorage.getItem('product_categories');
                if (local) return JSON.parse(local);
                localStorage.setItem('product_categories', JSON.stringify(defaultCats));
            } catch (err) {
                console.warn('[Database] LocalStorage read/write categories failed:', err);
            }
            return defaultCats;
        },

        addCategory: async function(category) {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('categories')
                        .insert([category]);
                    if (error) throw error;
                    return category;
                } catch (err) {
                    console.error('[Database] Supabase insert category failed:', err);
                }
            }

            // Local fallback
            try {
                const categories = await this.getCategories();
                categories.push(category);
                localStorage.setItem('product_categories', JSON.stringify(categories));
            } catch (err) {
                console.warn('[Database] LocalStorage save category failed:', err);
            }
            return category;
        },

        deleteCategory: async function(id) {
            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('categories')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase delete category failed:', err);
                }
            }

            // Local fallback
            try {
                let categories = await this.getCategories();
                categories = categories.filter(c => c.id !== id);
                localStorage.setItem('product_categories', JSON.stringify(categories));
            } catch (err) {
                console.warn('[Database] LocalStorage delete category failed:', err);
            }
        },

        getSettings: async function() {
            const defaultSettings = {
                id: 'current_settings',
                password: 'admin123',
                email: 'sonidiv1993@gmail.com',
                phone: '+91 86195 59916',
                web3forms_key: ''
            };

            if (useCloudDB && supabase) {
                try {
                    const { data, error } = await supabase
                        .from('admin_settings')
                        .select('*')
                        .eq('id', 'current_settings')
                        .single();
                    
                    if (data) {
                        // Upgrade Cloud if matching old default or typo
                        if (data.email === 'admin@lostart.com' || data.phone === '+91 89468 66094' || data.email === 'himanshugehlot521@gamil.com' || data.email === 'himanshugehlot521@gmail.com') {
                            data.email = defaultSettings.email;
                            data.phone = defaultSettings.phone;
                            await supabase.from('admin_settings').upsert([data]);
                        }
                        if (typeof data.web3forms_key === 'undefined') {
                            data.web3forms_key = '';
                        }
                        return data;
                    }
                    
                    // Seed settings table if empty
                    console.log('[Database] Cloud settings empty. Seeding defaults...');
                    await supabase.from('admin_settings').upsert([defaultSettings]);
                    return defaultSettings;
                } catch (err) {
                    console.warn('[Database] Supabase settings query failed, using local fallback.', err);
                }
            }

            // Local fallback
            try {
                const local = localStorage.getItem('admin_settings');
                if (local) {
                    const parsed = JSON.parse(local);
                    // Upgrade/migration path: ensure email and phone are updated to new default
                    if (parsed.email === 'admin@lostart.com' || parsed.phone === '+91 89468 66094' || parsed.email === 'himanshugehlot521@gamil.com' || parsed.email === 'himanshugehlot521@gmail.com' || !parsed.email || !parsed.phone || typeof parsed.web3forms_key === 'undefined') {
                        parsed.email = defaultSettings.email;
                        parsed.phone = defaultSettings.phone;
                        parsed.web3forms_key = parsed.web3forms_key || '';
                        localStorage.setItem('admin_settings', JSON.stringify(parsed));
                    }
                    return parsed;
                }
                localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
            } catch (err) {
                console.warn('[Database] LocalStorage read/write settings failed:', err);
            }
            return defaultSettings;
        },

        updateSettings: async function(settings) {
            const payload = {
                id: 'current_settings',
                password: settings.password,
                email: settings.email,
                phone: settings.phone,
                web3forms_key: settings.web3forms_key || ''
            };

            if (useCloudDB && supabase) {
                try {
                    const { error } = await supabase
                        .from('admin_settings')
                        .upsert([payload]);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.error('[Database] Supabase settings save failed:', err);
                }
            }

            // Local fallback
            try {
                localStorage.setItem('admin_settings', JSON.stringify(payload));
            } catch (err) {
                console.warn('[Database] LocalStorage update settings failed:', err);
            }
        }
    };
})();
