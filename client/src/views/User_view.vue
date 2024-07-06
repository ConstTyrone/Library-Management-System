<template>
  <div>
    <h2>Search Books</h2>
    <form @submit.prevent="searchBooks">
      <input v-model="keyword" placeholder="Keyword" />
      <select v-model="borrowable">
        <option value="">All</option>
        <option value="1">Borrowable</option>
        <option value="0">Not Borrowable</option>
      </select>
      <button type="submit">Search</button>
    </form>
    <ul>
      <li v-for="book in books" :key="book.bookid">{{ book.title }} by {{ book.author }}</li>
    </ul>
    <p v-if="message">{{ message }}</p>
  </div>
</template>
<script>
import axios from 'axios';
import PubSub from 'pubsub-js';
export default {
    name: 'SearchBooks',
  data() {
    return {
      token: '',
      keyword: '',
      borrowable: '',
      books: [],
      message: ''
    };
  },
  methods: {
    async searchBooks() {
      try {
        const response = await axios.get('/book/_token/search', {
          headers: {
              token:this.token
            },
          params: {
            keyword: this.keyword,
            borrowable: this.borrowable
          }
        } 
          );
        console.log('Response:', response);
        
        if (response.data && response.data.data && response.data.data.rows) {

          this.books = response.data.data.rows;
          this.message = 'Search successful';
        } else {
          this.message = 'No books found';
        }
      } catch (error) {
        console.error('Error searching books:', error);
        this.message = 'Error searching books';
      }
    }
  },
  mounted() {
    PubSub.subscribe('userEvent', (name, data) => {
      this.token = data
      console.log(this.token)
    })
  }
};
</script>