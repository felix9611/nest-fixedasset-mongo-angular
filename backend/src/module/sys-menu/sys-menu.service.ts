
/*

type Item = {
  _id: number;
  mainId: number;
  name: string;
  sort: number;
  children?: Item[];
};

function nestItems(items: Item[]): Item[] {
  const map = new Map<number, Item>(); // Store items by ID
  const roots: Item[] = []; // Store top-level items

  // First, populate the map
  items.forEach(item => map.set(item.id, { ...item, children: [] }));

  // Then, build the hierarchy
  items.forEach(item => {
    if (item.mainId === 0) {
      roots.push(map.get(item._id)!);
    } else {
      const parent = map.get(item.mainId);
      if (parent) {
        parent.children!.push(map.get(item._id)!);
      }
    }
  });

  // Sort recursively
  function sortItems(items: Item[]) {
    items.sort((a, b) => a.sort - b.sort);
    items.forEach(item => {
      if (item.children!.length > 0) {
        sortItems(item.children!);
      } else {
        delete item.children; // Remove empty children arrays
      }
    });
  }

  sortItems(roots);
  return roots;
}

// Test data
const data: Item[] = [
  { id: 1, mainId: 0, name: "Tongs", sort: 1 },
  { id: 2, mainId: 1, name: "Dogs", sort: 2 },
  { id: 3, mainId: 1, name: "Cats", sort: 1 },
  { id: 4, mainId: 0, name: "home", sort: 2 },
];

console.log(JSON.stringify(nestItems(data), null, 2));


*/