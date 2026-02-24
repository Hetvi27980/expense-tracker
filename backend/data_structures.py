"""
Data Structures: Trie, Heap, Stack implementations
Preserving original DSA logic from core.py
"""
import heapq
from typing import List, Optional

# ---------------------- TRIE (Smart Search) ---------------------- #
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def _dfs(self, node, prefix, results, limit):
        if len(results) >= limit:
            return
        if node.is_end:
            results.append(prefix)
        for ch, child in node.children.items():
            self._dfs(child, prefix + ch, results, limit)

    def starts_with(self, prefix: str, limit: int = 5) -> List[str]:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        results = []
        self._dfs(node, prefix, results, limit)
        return results

# ---------------------- HEAP (Top N Expenses) ---------------------- #
def get_top_n_expenses(expenses_list: List[dict], n: int = 5) -> List[dict]:
    """
    Uses heapq to get top N expenses by amount
    expenses_list: List of dicts with 'amount' key
    """
    if not expenses_list:
        return []
    # Create list of (amount, index) tuples
    amounts_list = [(exp["amount"], idx) for idx, exp in enumerate(expenses_list)]
    top = heapq.nlargest(n, amounts_list, key=lambda x: x[0])
    idxs = [i for _, i in top]
    return [expenses_list[i] for i in idxs]

# ---------------------- STACK (Undo Delete) ---------------------- #
class DeleteStack:
    def __init__(self):
        self.stack = []

    def push(self, item):
        self.stack.append(item)

    def pop(self) -> Optional[dict]:
        if self.stack:
            return self.stack.pop()
        return None

    def is_empty(self) -> bool:
        return len(self.stack) == 0

    def clear(self):
        self.stack.clear()
