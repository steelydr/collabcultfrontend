// useTrie.js
import { useMemo } from 'react';

class TrieNode {
  constructor() {
    this.children = new Map();
    this.users = new Set();
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, user) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
      node.users.add(user);
    }
  }

  search(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }
    return Array.from(node.users);
  }
}

export const useTrie = (userSuggestions, inputValue) => {
  const userTrie = useMemo(() => {
    const trie = new Trie();
    userSuggestions.forEach(user => {
      trie.insert((user.name || '').toLowerCase(), user);
      trie.insert((user.headline || '').toLowerCase(), user);
    });
    return trie;
  }, [userSuggestions]);

  const filteredSuggestions = useMemo(() => {
    const query = inputValue.toLowerCase();
    return userTrie.search(query).slice(0, 3);
  }, [userTrie, inputValue]);

  return { filteredSuggestions };
};
