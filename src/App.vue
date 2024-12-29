<template>
  <main class="app">
    <!-- Modal para Log Out -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Do you want to save your session?</h3>
        <div class="modal-actions">
          <button @click="handleSaveSession">Save</button>
          <button @click="handleCloseWithoutSaving">Close</button>
        </div>
      </div>
    </div>

    <!-- Pantalla inicial -->
    <section v-if="!name && !showModal" class="header">
      <h2 class="title">{{ sessionSaved ? "Choose an option" : "Hello, introduce your name" }}</h2>
      <div v-if="!sessionSaved">
        <input type="text" id="name" placeholder="Introduce your name" v-model="tempName" />
        <button @click="confirmName" :disabled="tempName.trim() === ''">
          Continue
        </button>
      </div>
      <div v-else>
        <button @click="loadSavedSession">
          Load saved session ({{ savedName }})
        </button>
        <button @click="startNewSession">New session</button>
      </div>
    </section>

    <!-- Sección principal -->
    <section v-else>
      <div class="header">
        <h2 class="title">Remember, {{ name }}</h2>
        <button @click="logOut">Log out</button>
      </div>

      <!-- Formulario para añadir tareas -->
      <section class="create-todo">
        <h3>YOUR TODO LIST</h3>
        <form id="new-todo-form" @submit.prevent="addItem">
          <h4>Insert your tasks</h4>
          <input type="text" name="content" id="content" placeholder="e.g. go to the gym" maxlength="65"
            v-model="input_content" />

          <h4>Choose category</h4>
          <div class="options">
            <label>
              <input type="radio" name="category" id="category1" value="business" v-model="input_category" />
              <span class="bubble business"></span>
              <div>Business</div>
            </label>

            <label>
              <input type="radio" name="category" id="category2" value="personal" v-model="input_category" />
              <span class="bubble personal"></span>
              <div>Personal</div>
            </label>

            <label>
              <input type="radio" name="category" id="category3" value="family" v-model="input_category" />
              <span class="bubble family"></span>
              <div>Family</div>
            </label>

            <label>
              <input type="radio" name="category" id="category4" value="studies" v-model="input_category" />
              <span class="bubble studies"></span>
              <div>Studies</div>
            </label>
          </div>

          <input type="submit" value="Add to the list" :disabled="!input_category" />
        </form>
      </section>

      <!-- Lista de tareas -->
      <section class="todo-list">
        <h3>TODO LIST</h3>
        <div class="list" id="todo-list">
          <div v-for="todo in items_asc" :key="todo.createdAt" :class="`todo-item ${todo.done ? 'done' : ''}`">
            <label>
              <input type="checkbox" v-model="todo.done" />
              <span :class="`bubble ${todo.category == 'business'
                ? 'business'
                : todo.category == 'personal'
                  ? 'personal'
                  : todo.category == 'family'
                    ? 'family'
                    : 'studies'
                }`"></span>
            </label>

            <div class="todo-content" :class="{ 'strikethrough': todo.done }">
              <input type="text" v-model="todo.content" maxlength="65" />
            </div>

            <div class="actions">
              <button class="delete" @click="removeItem(todo)">Delete</button>
            </div>
          </div>
        </div>

      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";

const items = ref([]);
const name = ref("");
const tempName = ref("");
const savedName = ref("");
const sessionSaved = ref(false);
const showModal = ref(false);
const input_content = ref("");
const input_category = ref(null);

const items_asc = computed(() =>
  items.value.sort((a, b) => b.createdAt - a.createdAt)
);

const addItem = () => {
  if (!input_content.value.trim() || !input_category.value) return;

  items.value.push({
    content: input_content.value,
    category: input_category.value,
    done: false,
    createdAt: Date.now(),
  });

  input_content.value = "";
  input_category.value = null;

  localStorage.setItem("items", JSON.stringify(items.value)); // Guarda las tareas
};

const removeItem = (todo) => {
  items.value = items.value.filter((t) => t !== todo);

  localStorage.setItem("items", JSON.stringify(items.value)); // Guarda las tareas
};

const confirmName = () => {
  name.value = tempName.value.trim();
};

const logOut = () => {
  showModal.value = true;
};

const handleSaveSession = () => {
  sessionSaved.value = true;
  localStorage.setItem("name", name.value);
  localStorage.setItem("items", JSON.stringify(items.value)); // Guarda las tareas
  savedName.value = name.value;
  name.value = "";
  items.value = [];
  showModal.value = false;
};

const handleCloseWithoutSaving = () => {
  localStorage.removeItem("name");
  localStorage.removeItem("items");
  sessionSaved.value = false;
  name.value = "";
  items.value = [];
  showModal.value = false;
};

const loadSavedSession = () => {
  name.value = savedName.value;
  items.value = JSON.parse(localStorage.getItem("items")) || []; // Carga las tareas guardadas
};

const startNewSession = () => {
  localStorage.removeItem("name");
  localStorage.removeItem("items");
  sessionSaved.value = false;
  name.value = "";
  items.value = [];
};

onMounted(() => {
  const storedName = localStorage.getItem("name");
  const storedItems = localStorage.getItem("items");

  if (storedName) {
    savedName.value = storedName;
    sessionSaved.value = true;
  }

  if (storedItems) {
    items.value = JSON.parse(storedItems); // Carga las tareas desde localStorage
  }
});
</script>
