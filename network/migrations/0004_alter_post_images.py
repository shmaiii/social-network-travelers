# Generated by Django 4.0.6 on 2022-08-12 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_post_images'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='images',
            field=models.ImageField(blank=True, upload_to='images/'),
        ),
    ]
