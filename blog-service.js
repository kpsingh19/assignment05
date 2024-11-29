//Karan Preet Singh, 157055229, kpsingh19@myseneca.ca
require('pg'); 
const Sequelize = require('sequelize');

const { Op } = require('sequelize');
	const Sequelize = require('sequelize');
	var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', '6UgE8zxckeuT', {
    host: 'ep-round-smoke-a59oo7t4-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Post = sequelize.define('Post', {
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    postDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    featureImage: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

const Category = sequelize.define('Category', {
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Post.belongsTo(Category, { foreignKey: 'category' });
  
sequelize.sync()
.then(() => {
    console.log("Database synchronized successfully.");
})
.catch((error) => {
    console.error("Error synchronizing the database:", error);
});


module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                console.log('Database synced successfully.');
                resolve();
            })
            .catch((err) => {
                console.error('Unable to sync the database:', err);
                reject("unable to sync the database");
            });
    });
};

module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll()
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data); 
                } else {
                    reject("no results returned"); 
                }
            })
            .catch((err) => {
                console.error("Error retrieving posts:", err);
                reject("no results returned"); 
            });
    });
};

module.exports.addCategory = function(categoryData) {
    return new Promise((resolve, reject) => {
        for (let key in categoryData) {
            if (categoryData[key] === "") {
                categoryData[key] = null;
            }
        }

        Category.create(categoryData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("unable to create category");
            });
    });
};


module.exports.deleteCategoryById = function(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        })
        .then((deletedCount) => {
            if (deletedCount >= 0) {
                resolve();
            } else {
                reject("category not found");
            }
        })
        .catch((err) => {
            reject("unable to delete category");
        });
    });
};

module.exports.deletePostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        })
        .then((deletedCount) => {
            if (deletedCount >= 0) {
                resolve();
            } else {
                reject("post not found");
            }
        })
        .catch((err) => {
            reject("unable to delete post");
        });
    });
};



module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { category: category } 
        })
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data); 
                } else {
                    reject("no results returned"); 
                }
            })
            .catch((err) => {
                console.error("Error retrieving posts by category:", err);
                reject("no results returned"); 
            });
    });
};


module.exports.getPostsByMinDate = function (minDateStr) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [Op.gte]: new Date(minDateStr) 
                }
            }
        })
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data);
                } else {
                    reject("no results returned"); 
                }
            })
            .catch((err) => {
                console.error("Error retrieving posts by min date:", err);
                reject("no results returned"); 
            });
    });
};

module.exports.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { id: id } 
        })
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data[0]); 
                } else {
                    reject("no results returned"); 
                }
            })
            .catch((err) => {
                console.error("Error retrieving post by ID:", err);
                reject("no results returned"); 
            });
    });
};

module.exports.deletePostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        })
        .then((deletedCount) => {
            if (deletedCount >= 0) {
                resolve();
            } else {
                reject("post not found");
            }
        })
        .catch((err) => {
            reject("unable to delete post");
        });
    });
    };
    

module.exports.addPost = function (postData) {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
    
        for (let key in postData) {
            if (postData[key] === "") {
                postData[key] = null; 
            }
        }
    
        postData.postDate = new Date();
    
        Post.create(postData)
            .then((newPost) => {
                console.log("New post created:", newPost);
                resolve(newPost);
            })
            .catch((err) => {
                console.error("Error creating post:", err);
                reject("unable to create post"); 
            });
    });
    };
    
    

module.exports.getPublishedPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { published: true } 
        })
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data); 
                } else {
                    reject("no results returned");
                }
            })
            .catch((err) => {
                console.error("Error retrieving published posts:", err);
                reject("no results returned"); 
            });
    });
};

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,   
                category: category 
            }
        })
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data); 
                } else {
                    reject("no results returned"); 
                }
            })
            .catch((err) => {
                console.error("Error retrieving published posts by category:", err);
                reject("no results returned"); 
            });
    });
};


module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        Category.findAll()  
            .then((data) => {
                if (data.length >= 0) {
                    resolve(data);  
                } else {
                    reject("no results returned"); 
                }
            })
            .catch((err) => {
                console.error("Error retrieving categories:", err);
                reject("no results returned"); 
            });
    });
};

