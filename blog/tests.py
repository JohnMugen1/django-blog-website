from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from .models import Post


class BlogTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@gmail.com',
            password='secret'
        )

        self.post = Post.objects.create(
            title='test',
            body='blog test',
            author=self.user
        )

    def test_str_representation(self):
        post = Post(title='test blog')
        self.assertEqual(str(post), post.title)

    def test_get_absolute_url(self):
        self.assertEqual(
            self.post.get_absolute_url(),
            f"/post/{self.post.pk}/"
        )

    def test_post_content(self):
        self.assertEqual(self.post.title, 'test')
        self.assertEqual(self.post.author.username, 'testuser')
        self.assertEqual(self.post.body, 'blog test')

    def test_post_list_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'blog test')
        self.assertTemplateUsed(response, 'home.html')

    def test_post_detail_view(self):
        response = self.client.get(
            reverse('post_detail', args=[self.post.pk])
        )
        no_response = self.client.get(
            reverse('post_detail', args=[999])
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(no_response.status_code, 404)
        self.assertContains(response, 'test')
        self.assertTemplateUsed(response, 'post_detail.html')

    def test_post_create_view(self): # new
        response = self.client.post(reverse('post_new'), {
        'title': 'New title',
        'body': 'New text',
        'author': self.user,
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'New title')
        self.assertContains(response, 'New text')

    def test_post_update_view(self):
        self.client.login(username='testuser', password='secret')

        response = self.client.post(
            reverse('post_edit', args=[self.post.pk]),
            {
                'title': 'Updated title',
                'body': 'Updated Body'
            }
        )

        self.assertIn(response.status_code, [200, 302])

        self.post.refresh_from_db()
        self.assertEqual(self.post.title, 'Updated title')

    def test_post_delete_view(self):
        self.client.login(username='testuser', password='secret')

        response = self.client.post(
            reverse('delete_post', args=[self.post.pk])
        )

        self.assertIn(response.status_code, [200, 302])

        self.assertFalse(
            Post.objects.filter(pk=self.post.pk).exists()
        )
