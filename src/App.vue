<script setup>
import { ref, onMounted, computed, watch } from "vue";

const items = ref([]);
const name = ref("");
const input_content = ref("");
const input_category = ref(null);

const items_asc = computed(() =>
  items.value.sort((a, b) => {
    return a.createdAt - b.createdAt;
  })
);

watch(name, (newValue) => {
  localStorage.setItem("name", newValue);
});

watch(
  items,
  (newValue) => {
    localStorage.setItem("items", JSON.stringify(newValue));
  },
  {
    deep: true,
  }
);

const addItem = () => {
  if (input_content.value.trim() === "" || input_category.value === null) {
    return;
  }

  items.value.push({
    content: input_content.value,
    category: input_category.value,
    done: false,
    editable: false,
    createdAt: new Date().getTime(),
  });
};

const removeItem = (todo) => {
  items.value = items.value.filter((t) => t !== todo);
};

onMounted(() => {
  name.value = localStorage.getItem("name") || "";
  items.value = JSON.parse(localStorage.getItem("items")) || [];
});
</script>

<template>
  <main class="app">
    <section class="header">
      <h2 class="title">
        Remember,
        <input type="text" id="name" placeholder="Name here" v-model="name" />
      </h2>
    </section>

    <section class="create-todo">
      <h3>YOUR TODO LIST</h3>

      <form id="new-todo-form" @submit.prevent="addItem">
        <h4>Insert your tasks</h4>
        <input
          type="text"
          name="content"
          id="content"
          placeholder="e.g. go to the gym"
          maxlength="40"
          v-model="input_content"
        />

        <h4>Choose category</h4>
        <div class="options">
          <label>
            <input
              type="radio"
              name="category"
              id="category1"
              value="business"
              v-model="input_category"
            />
            <span class="bubble business"></span>
            <div>Business</div>
          </label>

          <label>
            <input
              type="radio"
              name="category"
              id="category2"
              value="personal"
              v-model="input_category"
            />
            <span class="bubble personal"></span>
            <div>Personal</div>
          </label>

          <label>
            <input
              type="radio"
              name="category"
              id="category3"
              value="family"
              v-model="input_category"
            />
            <span class="bubble family"></span>
            <div>Family</div>
          </label>

          <label>
            <input
              type="radio"
              name="category"
              id="category4"
              value="studies"
              v-model="input_category"
            />
            <span class="bubble studies"></span>
            <div>Studies</div>
          </label>
        </div>

        <input type="submit" value="Add to the list" />
      </form>
    </section>

    <section class="todo-list">
      <h3>TODO LIST</h3>
      <div class="list" id="todo-list">
        <div
          v-for="todo in items_asc"
          :class="`todo-item ${todo.done && 'done'}`"
        >
          <label>
            <input type="checkbox" v-model="todo.done" />
            <span
              :class="`bubble ${
                todo.category == 'business'
                  ? 'business'
                  : todo.category == 'personal'
                  ? 'personal'
                  : todo.category == 'family'
                  ? 'family'
                  : 'studies'
              }`"
            ></span>
          </label>

          <div class="todo-content">
            <input type="text" v-model="todo.content" maxlength="40"/>
          </div>

          <div class="actions">
            <button class="delete" @click="removeItem(todo)">Delete</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
