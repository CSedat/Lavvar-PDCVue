<template>
  <div id="login" class="flex flex-col top-10 items-center justfliy-center">
    <img class="w-96" src="../assets/polyakeynez.png" alt="" />
    <h1 class="text-lg font-semibold uppercase">Lavvar PLC Kayıt Sistemi</h1>
    <div
      class="
        flex flex-col
        top-10
        items-center
        justfliy-center
        p-8
        bg-gray-700
        rounded
      "
    >
      <div>
        <input
          type="text"
          name="username"
          class="text-black rounded m-1 p-1 w-48"
          v-model="username"
          placeholder="Kullanıcı Adı"
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          class="text-black rounded m-1 p-1 w-48"
          v-model="password"
          placeholder="Şifre"
        />
      </div>
      <button
        type="button"
        class="
          transition-all
          font-bold
          text-white
          bg-gradient-to-r
          from-green-800
          to-blue-800
          hover:from-pink-800 hover:to-yellow-800
          top-2
          h-10
          w-10/12
          rounded
        "
        v-on:click="login()"
      >
        Giriş Yap
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: ["bool"],
  data() {
    return {
      username: "",
      password: "",
      showRouter: false,
    };
  },
  mounted() {},
  methods: {
    login() {
      if (this.username != "" && this.password != "") {
        if (this.username == "lavvarkantar" && this.password == "1925") {
          console.log("Login success");
          this.$router.push({ name: "pdc" });
          this.bool = true;
        } else {
          alert("Kullanıcı adı veya şifre yanlış.");
        }
      } else {
        alert("Kullanıcı adı veye şifre boş olamaz.");
      }
    },
  },
};
</script>
